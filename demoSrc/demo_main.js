import * as dat from "dat.gui";
import { Mesh, Scene, SphereGeometry, Spherical, Vector3 } from "three";
import { Common } from "./Common";
import {
  SphericalController,
  SphericalControllerEventType,
  SphericalControllerUtil,
  SphericalParamType
} from "../bin";

const W = 1280;
const H = 800;
let renderer;
let scene;
let camera;
// let cameraController;

const R = 105;

const onDomContentsLoaded = () => {
  // シーンを作成
  scene = new Scene();
  camera = Common.initCamera(scene, W, H);
  renderer = Common.initRenderer(W, H);
  Common.initLight(scene);

  testPI2();

  Common.initHelper(scene);
  Common.initCube(scene);
  const target = initTarget();

  const controller = initController(target, R);
  checkPlaying(controller);
  Common.render(renderer, scene, camera);

  initGUI(controller);
};

const testPI2 = () => {
  console.log(SphericalControllerUtil.PI2ToPI(0) === 0);
  console.log(SphericalControllerUtil.PI2ToPI(Math.PI) === Math.PI);
  console.log(SphericalControllerUtil.PI2ToPI(-Math.PI) === -Math.PI);
  console.log(SphericalControllerUtil.PI2ToPI(Math.PI * 2));
  console.log(
    SphericalControllerUtil.PI2ToPI(Math.PI + 0.01) === -Math.PI + 0.01
  );
  console.log(
    Math.abs(SphericalControllerUtil.PI2ToPI(Math.PI * 200 + 0.01) - 0.01) <
      0.000001
  );
};

const initTarget = () => {
  const geo = new SphereGeometry(1);
  const cameraTarget = new Mesh(geo);
  scene.add(cameraTarget);
  return cameraTarget;
};

const initController = (cameraTarget, R) => {
  const cameraController = new SphericalController(camera, cameraTarget);
  cameraController.initCameraPosition(
    new Spherical(R, 0.0001, Math.PI * 2 * 12)
  );
  cameraController.initCameraShift(new Vector3(20, 0, 0));
  cameraController.duration = 1666;

  cameraController.addEventListener(
    SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
    e => {
      console.log("Complete : ", e);
    }
  );

  return cameraController;
};

const checkPlaying = controller => {
  setInterval(() => {
    console.log(controller.tweens.isPlaying());
  }, 100);
};

const initGUI = controller => {
  const gui = new dat.GUI();
  initRandomGUI(gui, controller);
  initAddGUI(gui, controller);
  initLoopGUI(gui, controller);
};

let randomAnimationID;

const initRandomGUI = (gui, controller) => {
  const prop = {
    toggleRandomMove: () => {
      if (randomAnimationID != null) {
        stopRandomAnimation(controller);
      } else {
        startRandomAnimation(controller);
      }
    }
  };

  gui.add(prop, "toggleRandomMove");
};

const stopRandomAnimation = controller => {
  controller.tweens.stop();
  clearInterval(randomAnimationID);
  randomAnimationID = null;
};

const startRandomAnimation = controller => {
  const move = () => {
    const to = new Spherical(
      R,
      // Math.random() * 70 + 35,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 6 - Math.PI * 3
    );
    controller.move(to, {
      duration: 1500,
      easing: createjs.Ease.cubicOut
    });
    console.log("Start : ", to);
  };
  move();
  randomAnimationID = setInterval(move, 2000);
};

const initAddGUI = (gui, controller) => {
  const folder = gui.addFolder("add method");
  folder.open();
  const moveAngle = 0.1;
  const prop = {
    addR: () => {
      controller.addPosition(SphericalParamType.R, 5);
    },
    subR: () => {
      controller.addPosition(SphericalParamType.R, -5);
    },
    addPhi: () => {
      controller.addPosition(SphericalParamType.PHI, moveAngle);
    },
    subPhi: () => {
      controller.addPosition(SphericalParamType.PHI, -moveAngle);
    },
    addTheta: () => {
      controller.addPosition(SphericalParamType.THETA, moveAngle);
    },
    subTheta: () => {
      controller.addPosition(SphericalParamType.THETA, -moveAngle);
    }
  };

  folder.add(prop, "addR");
  folder.add(prop, "subR");
  folder.add(prop, "addPhi");
  folder.add(prop, "subPhi");
  folder.add(prop, "addTheta");
  folder.add(prop, "subTheta");
};

const initLoopGUI = (gui, controller) => {
  const folder = gui.addFolder("loop method");
  folder.open();

  const flags = {
    isLoopR: false,
    isLoopPhi: false,
    isLoopTheta: false
  };
  const option = {
    duration: 10 * 1000
  };
  const prop = {
    loopR: () => {
      if (flags.isLoopR) {
        controller.stopLoop(SphericalParamType.R);
      } else {
        controller.loop(SphericalParamType.R, 30, 150, option);
      }
      flags.isLoopR = !flags.isLoopR;
    },
    loopPhi: () => {
      if (flags.isLoopPhi) {
        controller.stopLoop(SphericalParamType.PHI);
      } else {
        controller.loop(SphericalParamType.PHI, 0, Math.PI, option);
      }
      flags.isLoopPhi = !flags.isLoopPhi;
    },
    loopTheta: () => {
      if (flags.isLoopTheta) {
        controller.stopLoop(SphericalParamType.THETA);
      } else {
        controller.loop(
          SphericalParamType.THETA,
          -Math.PI / 4,
          Math.PI / 4,
          option
        );
      }
      flags.isLoopTheta = !flags.isLoopTheta;
    }
  };

  folder.add(prop, "loopR");
  folder.add(prop, "loopPhi");
  folder.add(prop, "loopTheta");
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
window.onload = onDomContentsLoaded;
