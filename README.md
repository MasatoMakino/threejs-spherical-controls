# threejs-spherical-controls

> Spherical camera controller for Three.js

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![build test](https://github.com/MasatoMakino/threejs-spherical-controls/actions/workflows/ci_main.yml/badge.svg)](https://github.com/MasatoMakino/threejs-spherical-controls/actions/workflows/ci_main.yml)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=threejs-spherical-controls)](https://github.com/MasatoMakino/threejs-spherical-controls)

## Demo

[Demo Page](https://masatomakino.github.io/threejs-spherical-controls/demo/)

## Getting Started

### Install

```bash
npm install @masatomakino/threejs-spherical-controls --save-dev
```

## Features

- Smooth spherical camera movement with tweening
- Event-driven architecture for animation control
- Loop animations for continuous movement
- Position constraints to prevent invalid positions
- Integration with RAF (RequestAnimationFrame) ticker
- Support for custom easing functions

### Basic Usage

```js
import { SphericalController, generateCameraTarget } from "@masatomakino/threejs-spherical-controls";
import { Spherical, Vector3 } from "three";
import { Easing } from "@tweenjs/tween.js";

// Create camera target (invisible sphere that camera looks at)
const cameraTarget = generateCameraTarget();
scene.add(cameraTarget);

// Initialize controller
const controller = new SphericalController(camera, cameraTarget);

// Set initial position (radius: 50, phi: near 0, theta: 0)
controller.initCameraPosition(new Spherical(50, 0.0001, 0));

// Move to new position with animation
controller.move(new Spherical(50, Math.PI / 2, Math.PI / 4), {
  duration: 1500,
  easing: Easing.Cubic.Out
});
```

### Event Handling

```js
// Listen for animation completion
controller.on("moved_camera_complete", (event) => {
  console.log("Camera movement completed", event);
});

// Listen for animation updates
controller.on("moved_camera", (event) => {
  console.log("Camera movement", event);
});
```

### Advanced Features

#### Incremental Movement
```js
// Add to current position
controller.addPosition("radius", -10);    // Move closer
controller.addPosition("phi", 0.1);       // Rotate vertically
controller.addPosition("theta", 0.2);     // Rotate horizontally
```

#### Loop Animations
```js
// Create continuous oscillation between two values
controller.loop("theta", -Math.PI/4, Math.PI/4, {
  duration: 5000,
  easing: Easing.Sinusoidal.InOut
});

// Stop loop animation
controller.stopLoop("theta");
```

#### Position Constraints
```js
// Set movement limits
controller.limiter.setLimit("phi", 0.1, Math.PI - 0.1);      // Vertical limits
controller.limiter.setLimit("theta", -Math.PI, Math.PI);     // Horizontal limits
controller.limiter.setLimit("radius", 10, 100);              // Distance limits
```

#### Camera Offset
```js
// Shift camera position relative to target
controller.initCameraShift(new Vector3(0, 10, 0));
```

### Available Imports

```js
import {
  SphericalController,        // Main controller class
  generateCameraTarget,       // Utility to create camera target
  EasingOption,              // Animation options interface
  SphericalControllerUtil,   // Utility functions
  CameraPositionUpdater,     // Camera positioning logic
  CameraPositionLimiter,     // Position constraint logic
  // ... and more
} from "@masatomakino/threejs-spherical-controls";
```

## Coordinate System

The controller uses spherical coordinates:
- **Radius**: Distance from target (> 0)
- **Phi**: Vertical rotation (0 to π, where 0 = North Pole, π = South Pole)
- **Theta**: Horizontal rotation (-π to π, where 0 = positive Z axis)

## API Documentation

[API documents](https://masatomakino.github.io/threejs-spherical-controls/api/index.html)

## License

[MIT license](LICENSE)
