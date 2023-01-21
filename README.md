# threejs-spherical-controls

> Spherical camera controller for Three.js

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![build test](https://github.com/MasatoMakino/threejs-spherical-controls/actions/workflows/ci_main.yml/badge.svg)](https://github.com/MasatoMakino/threejs-spherical-controls/actions/workflows/ci_main.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/2f9b5a94f146fec74465/maintainability)](https://codeclimate.com/github/MasatoMakino/threejs-spherical-controls/maintainability)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=threejs-spherical-controls)](https://github.com/MasatoMakino/threejs-spherical-controls)

## Demo

[Demo Page](https://masatomakino.github.io/threejs-spherical-controls/demo/)

## Getting Started

### Install

threejs-spherical-controls depend on [three.js](https://threejs.org/) and [@tweenjs/tween.js](https://github.com/tweenjs/tween.js/)

```bash
npm install three @tweenjs/tween.js --save-dev
```

and

```bash
npm install @masatomakino/threejs-spherical-controls --save-dev
```

### Import

threejs-spherical-controls is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import { SphericalController } from "@masatomakino/threejs-spherical-controls";
```

### Set up controller

```js
const cameraTarget = new Mesh(new SphereGeometry(1));
scene.add(cameraTarget);

const cameraController = new SphericalController(camera, cameraTarget);
cameraController.initCameraPosition(
  new Spherical(radius, 0, 0) // => North Pole
);
cameraController.move(
  new Spherical(radius, Math.PI, 0) // => South Pole
);
```

[API documents](https://masatomakino.github.io/threejs-spherical-controls/api/index.html)

## License

[MIT license](LICENSE)
