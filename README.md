# threejs-spherical-controls

Spherical camera controller for Three.js

[![Maintainability](https://api.codeclimate.com/v1/badges/2f9b5a94f146fec74465/maintainability)](https://codeclimate.com/github/MasatoMakino/threejs-spherical-controls/maintainability)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=threejs-spherical-controls&show_owner=true)](https://github.com/MasatoMakino/threejs-spherical-controls)

## Demo

[Demo Page](https://masatomakino.github.io/threejs-spherical-controls/demo/)

## Getting Started

### Install

threejs-spherical-controls depend on [three.js](https://threejs.org/) and [CreateJS / TweenJS](https://github.com/CreateJS/TweenJS)

```bash
npm install three tweenjs --save-dev
```

and

```bash
npm install https://github.com/MasatoMakino/threejs-spherical-controls.git --save-dev
```

### Import

threejs-spherical-controls is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import { SphericalController } from "threejs-spherical-controls";
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

[API documents](https://masatomakino.github.io/threejs-spherical-controls/api/)

## License

threejs-spherical-controls is [MIT licensed](LICENSE).
