# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library for Three.js that provides spherical camera controls with smooth transitions and positioning constraints. The library uses an event-driven architecture and integrates with the RAF (RequestAnimationFrame) ticker system.

### Runtime Environment
This module is designed to be bundled with Three.js and executed in browser environments. Node.js execution is not supported and is outside the scope of this library. When installing dependencies for development or testing purposes, use `--save-dev` to install as development dependencies only.

## DevContainer Isolated Environment

**This project uses DevContainer for npm execution isolation to protect against supply chain attacks.**

### Purpose
- Isolate npm package execution from the host OS
- Protect host system from potentially malicious packages
- Use Docker named volumes to completely separate node_modules from host filesystem
- Run all npm commands exclusively in a sandboxed Linux container

### Architecture
- Base image: `mcr.microsoft.com/devcontainers/javascript-node:22`
- Security: `--cap-drop=ALL` (removes all Linux capabilities)
- Named volume: `threejs-spherical-controls-npm-runner-node_modules`
- Port forwarding: 3000 (browser-sync), 3001 (browser-sync UI)

### Commands on Host OS (SAFE)
```bash
# DevContainer operations
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . <command>

# Git operations (Git is not available in container)
git status
git add .
git commit
git push

# File operations
ls, cat, grep, find  # Read-only operations on host
```

### Commands in Container (npm execution)
```bash
# Execute npm commands via devcontainer exec
devcontainer exec --workspace-folder . npm install
devcontainer exec --workspace-folder . npm test
devcontainer exec --workspace-folder . npm run build

# Or enter the container shell
devcontainer exec --workspace-folder . /bin/bash
```

### Commands NEVER to Run on Host OS
```bash
# ❌ NEVER run npm directly on host OS
npm install   # DANGEROUS: Executes package scripts on host
npm ci        # DANGEROUS: Executes package scripts on host
npm test      # DANGEROUS: May execute malicious code
npm run *     # DANGEROUS: Any npm script execution

# ❌ NEVER run node directly on host OS
node script.js  # DANGEROUS: Uncontrolled code execution
```

### Commands NOT Available in Container
```bash
# Git operations are intentionally disabled in container
git commit    # ❌ Not available (security isolation)
git push      # ❌ Not available (security isolation)

# These must be run on host OS
```

### Development Workflow
1. **Start DevContainer**: `devcontainer up --workspace-folder .`
2. **Install dependencies** (in container): `devcontainer exec --workspace-folder . npm ci`
3. **Run dev server** (in container): `devcontainer exec --workspace-folder . npm run start:dev`
4. **Edit files** on host OS (your IDE/editor)
5. **Hot reload** automatically detects changes and rebuilds
6. **Access demo** at `http://localhost:3000` from host OS browser
7. **Git operations** on host OS only

### Git Hooks Setup (Optional but Recommended)

**Why Husky was removed:**
- Husky relies on npm package scripts to install Git hooks
- The npm isolation container does not have access to Git credentials
- Git operations must run on the host OS, but npm-dependent hooks cannot execute there
- This architectural conflict makes Husky incompatible with the isolation strategy

**Manual Git Hooks Approach:**
Each developer is responsible for setting up Git hooks on their local machine. This ensures:
- Git operations remain on the host OS (where credentials exist)
- Hook scripts delegate to isolated container for npm script execution
- Quality checks run in the secure container environment

**Setup Instructions:**
1. Remove Husky's Git config (if migrating from Husky):
   ```bash
   git config --unset core.hooksPath
   ```

2. Create hook files in `.git/hooks/`:
   ```bash
   # Create pre-commit hook
   cat > .git/hooks/pre-commit << 'EOF'
   #!/bin/sh
   # Redirect output to stderr.
   exec 1>&2

   echo "[pre-commit] Running code quality checks in DevContainer..."

   # Check if DevContainer is running, start if needed
   if ! docker ps --format '{{.Names}}' | grep -q 'threejs-spherical-controls-npm-runner'; then
     echo "[pre-commit] DevContainer not running. Starting..."
     devcontainer up --workspace-folder . || exit 1
   fi

   # Run pre-commit checks in container
   if ! devcontainer exec --workspace-folder . npm run pre-commit; then
     echo "[pre-commit] ERROR: Code quality checks failed"
     exit 1
   fi

   echo "[pre-commit] ✓ All checks passed"
   exit 0
   EOF

   # Create pre-push hook
   cat > .git/hooks/pre-push << 'EOF'
   #!/bin/sh
   # Redirect output to stderr.
   exec 1>&2

   echo "[pre-push] Running tests and CI checks in DevContainer..."

   # Check if DevContainer is running, start if needed
   if ! docker ps --format '{{.Names}}' | grep -q 'threejs-spherical-controls-npm-runner'; then
     echo "[pre-push] DevContainer not running. Starting..."
     devcontainer up --workspace-folder . || exit 1
   fi

   # Run pre-push checks in container
   if ! devcontainer exec --workspace-folder . npm run pre-push; then
     echo "[pre-push] ERROR: Tests or CI checks failed"
     exit 1
   fi

   echo "[pre-push] ✓ All checks passed"
   exit 0
   EOF

   # Make hooks executable
   chmod +x .git/hooks/pre-commit .git/hooks/pre-push
   ```

3. Verify hooks are working:
   ```bash
   # Test with empty commit
   git commit --allow-empty -m "test: Verify hooks"
   git reset --hard HEAD~1  # Remove test commit
   ```

**Important Notes:**
- Git hooks are stored in `.git/hooks/` (not version controlled)
- Each developer must set up hooks independently
- Hooks automatically start the DevContainer if not running
- All npm script execution happens in the isolated container
- Git operations remain on the host OS with proper credentials

**Manual Alternative:**
If you prefer not to use Git hooks, run these commands manually before committing:
```bash
devcontainer exec --workspace-folder . npm run pre-commit  # Biome check + auto-fix
devcontainer exec --workspace-folder . npm run pre-push    # Biome CI + tests
```

### Security Benefits
- Host OS npm is never executed (protection from malicious package scripts)
- Container runs with minimal Linux capabilities
- node_modules isolated in Docker volume (not accessible from host filesystem)
- Automatic `npm audit` on container start
- Non-root user (node) in container

## Development Commands

### Essential Commands
```bash
npm run start:dev    # Runs development server + TypeScript watch + demo watch
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run coverage     # Generate test coverage report
npm run buildTS      # Compile TypeScript to ES modules
```

### Code Quality
```bash
biome check --no-errors-on-unmatched      # Check code formatting and linting
biome check --write --no-errors-on-unmatched  # Fix code formatting and linting issues
```

### Documentation & Demo
```bash
npm run demo         # Build demo page
npm run typedocs     # Generate TypeDoc API documentation
npm run build        # Build both docs and demo
```

## Testing

- Framework: Vitest with jsdom environment
- Test files are in `__test__/` directory
- Good test coverage across multiple test suites
- Run `npm run coverage` to generate coverage reports

## Code Architecture

### RequestAnimationFrame Handling
This module automatically handles camera animation updates through the `@masatomakino/raf-ticker` system. Users do not need to manually call `requestAnimationFrame` - the camera animations are automatically updated by the RAF ticker integration.

### Core Classes

1. **SphericalController** - Main controller extending EventEmitter3
   - Manages camera positioning in spherical coordinates
   - Handles smooth transitions with Tween.js integration
   - Event-driven architecture for decoupled communication

2. **CameraPositionUpdater** - Handles camera position calculations
   - Updates camera position based on spherical coordinates
   - Manages camera lookAt behavior

3. **CameraPositionLimiter** - Enforces movement constraints
   - Limits phi/theta ranges to prevent invalid positions

4. **SphericalControllerTween** - Animation management
   - Handles smooth transitions between camera positions
   - Integrates with @tweenjs/tween.js for easing

### Key Dependencies (Peer Dependencies)
- `three` - Three.js library (>=0.126.0 <1.0.0)
- `@tweenjs/tween.js` - Animation library
- `eventemitter3` - Event emitter for event-driven architecture
- `@masatomakino/raf-ticker` - RequestAnimationFrame ticker system

### Architecture Patterns
- Event-driven design using EventEmitter3
- Modular components with single responsibilities
- TypeScript-first with strict typing
- Dependency injection for camera and target mesh

## File Structure

- `src/` - TypeScript source code (9 modules)
- `esm/` - Compiled ES modules output with TypeScript declarations
- `__test__/` - Vitest test files
- `demoSrc/` - Demo application source
- `docs/` - Generated documentation and demo

## Code Style & Tools

- **Biome** is used for linting and formatting (not ESLint/Prettier)
- TypeScript with strict mode enabled
- ES modules with modern JavaScript features
- Pre-commit checks via npm scripts (husky removed for DevContainer compatibility)

## Build Output

The library is published as ES modules in the `esm/` directory with TypeScript declaration files. The package.json uses modern exports field for proper ES module resolution.

## Testing Strategy

### Test Structure
- Multiple test suites covering all major functionality
- Tests use Vitest with jsdom environment for browser API simulation
- Test files follow `*.spec.ts` naming convention
- Key test areas:
  - Core SphericalController functionality
  - Position limiting and validation
  - Animation tweening and looping
  - Camera position updates
  - Event emission and handling

### Running Single Tests
```bash
# Run a specific test file
npx vitest __test__/SphericalController.spec.ts

# Run tests matching a pattern
npx vitest --grep "addPosition"
```

## Spherical Coordinate System

The library uses Three.js spherical coordinates with these conventions:
- **Radius**: Distance from target (must be > 0)
- **Phi**: Vertical angle (0 to π, where 0 = North Pole, π = South Pole)  
- **Theta**: Horizontal angle (-π to π, where 0 = positive Z axis)

**Important**: Phi values of exactly 0 or π are not supported due to coordinate singularities at the poles.

## Key Implementation Details

### Event System
The SphericalController extends EventEmitter3 and emits these events:
- `update` - Camera position/target/shift changed (emitted by SphericalController)
- `moved_camera` - Camera position updated during animation (emitted by CameraPositionUpdater)  
- `moved_camera_complete` - Animation completed (emitted by SphericalController)

### Animation Integration
- All animations automatically integrate with `@masatomakino/raf-ticker`
- Uses `@tweenjs/tween.js` for smooth transitions
- No manual `requestAnimationFrame` calls needed

### Memory Management
Always call `dispose()` on SphericalController instances to:
- Remove RAF ticker listeners
- Stop all active tweens
- Clean up event listeners
- Dispose camera updater