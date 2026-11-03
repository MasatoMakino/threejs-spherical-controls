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
- Run all npm commands exclusively in a sandboxed Linux container

### Architecture

- Base image: `node:22-bookworm-slim` with pnpm installed by `.devcontainer/Dockerfile` (no Git)
- Security: `--cap-drop=ALL` (removes all Linux capabilities)
- Non-root user: `node` (UID:1000, GID:1000)
- Port mapping: container port 3000 (demo-showcase dev server) to an ephemeral host port on `127.0.0.1`

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

### Commands in Container (pnpm execution)

```bash
# Execute pnpm commands via devcontainer exec
devcontainer exec --workspace-folder . pnpm install --frozen-lockfile
devcontainer exec --workspace-folder . pnpm test
devcontainer exec --workspace-folder . pnpm run build

# Or enter the container shell
devcontainer exec --workspace-folder . /bin/bash
```

### Commands NEVER to Run on Host OS

```bash
# ❌ NEVER run npm or pnpm directly on host OS
npm install   # DANGEROUS: Executes package scripts on host
npm ci        # DANGEROUS: Executes package scripts on host
npm test      # DANGEROUS: May execute malicious code
npm run *     # DANGEROUS: Any npm script execution
pnpm install  # DANGEROUS: Same risks as npm
pnpm run *    # DANGEROUS: Same risks as npm

# ❌ NEVER run node directly on host OS
node script.js  # DANGEROUS: Uncontrolled code execution
```

### Git and the container

The container has no Git. Git operations run on the host OS, where credentials and signing keys exist. The pre-commit hook collects staged file paths on the host and passes them to Biome in the container.

### Development Workflow

1. **Start DevContainer**: `devcontainer up --workspace-folder .`
2. **Install dependencies** (in container): `devcontainer exec --workspace-folder . pnpm install --frozen-lockfile`
3. **Run dev server** (in container): `devcontainer exec --workspace-folder . pnpm run start:dev`
4. **Edit files** on host OS (your IDE/editor)
5. **Hot reload** automatically detects changes and rebuilds
6. **Access demo** from the host OS browser at the port that `docker port threejs-spherical-controls-pnpm-runner 3000` prints. The host port changes on each container start
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

2. Copy the hook files from `.devcontainer/git-hooks/` to `.git/hooks/`:

   ```bash
   cp .devcontainer/git-hooks/pre-commit .devcontainer/git-hooks/pre-push .git/hooks/
   chmod +x .git/hooks/pre-commit .git/hooks/pre-push
   ```

3. Verify hooks are working:

   ```bash
   # Test with empty commit
   git commit --allow-empty -m "test: Verify hooks"
   git reset --hard HEAD~1  # Remove test commit
   ```

**Important Notes:**
- Git hooks run from `.git/hooks/`, which is not version controlled. `.devcontainer/git-hooks/` holds the shared copies
- Each developer must set up hooks independently
- The pre-commit hook formats staged files with Biome in the container, then stages them again. Re-staging adds the whole file, including unstaged changes in a partially staged file
- Hooks automatically start the DevContainer if not running
- All npm script execution happens in the isolated container
- Git operations remain on the host OS with proper credentials

**Manual Alternative:**
If you prefer not to use Git hooks, run these commands manually before committing:
```bash
devcontainer exec --workspace-folder . pnpm run pre-commit <files>  # Biome format
devcontainer exec --workspace-folder . pnpm run pre-push    # Biome CI + tests
```

### Security Benefits

- Host OS npm and pnpm are never executed (protection from malicious package scripts)
- Container runs with minimal Linux capabilities (`--cap-drop=ALL`)
- Non-root user (node) execution in container
- Automatic `pnpm audit` on container start

**Note on Security Trade-off:**
Volume-based node_modules isolation was removed to restore host IDE access to TypeScript type definitions. Security now relies on container user and capability restrictions rather than volume isolation. This trade-off prioritizes developer experience (IDE type support) while maintaining npm execution isolation.

## Development Commands

### Essential Commands

```bash
pnpm run start:dev    # Runs TypeScript watch + demo-showcase Vite dev server with HMR
pnpm run test         # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run coverage     # Generate test coverage report
pnpm run buildTS      # Compile TypeScript to ES modules
```

### Code Quality

```bash
biome check --no-errors-on-unmatched      # Check code formatting and linting
biome check --write --no-errors-on-unmatched  # Fix code formatting and linting issues
```

### Demo

```bash
pnpm run demo         # Build demo page
pnpm run build        # Build demo page (used by the GitHub Pages workflow)
```

## Testing

- Framework: Vitest with jsdom environment
- Test files are in `__test__/` directory
- Good test coverage across multiple test suites
- Run `pnpm run coverage` to generate coverage reports

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
- `docs/` - Generated demo

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
pnpm exec vitest __test__/SphericalController.spec.ts

# Run tests matching a pattern
pnpm exec vitest --grep "addPosition"
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
