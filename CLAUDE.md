# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library for Three.js that provides spherical camera controls with smooth transitions and positioning constraints. The library uses an event-driven architecture and integrates with the RAF (RequestAnimationFrame) ticker system.

### Runtime Environment
This module is designed to be bundled with Three.js and executed in browser environments. Node.js execution is not supported and is outside the scope of this library. When installing dependencies for development or testing purposes, use `--save-dev` to install as development dependencies only.

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
- Good test coverage across 8 test suites
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
- Husky git hooks with lint-staged for pre-commit checks

## Build Output

The library is published as ES modules in the `esm/` directory with TypeScript declaration files. The package.json uses modern exports field for proper ES module resolution.