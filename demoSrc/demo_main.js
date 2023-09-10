import GUI from "lil-gui";
import { Scene, Spherical, Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { Common } from "./Common.js";
import { SphericalController, SphericalControllerUtil } from "../esm/index.js";

const W = 1280;
const H = 800;
let renderer;
let scene;
let camera;
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
  const target = SphericalControllerUtil.generateCameraTarget();
  scene.add(target);

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
    SphericalControllerUtil.PI2ToPI(Math.PI + 0.01) === -Math.PI + 0.01,
  );
  console.log(
    Math.abs(SphericalControllerUtil.PI2ToPI(Math.PI * 200 + 0.01) - 0.01) <
      0.000001,
  );
};

const initController = (cameraTarget, R) => {
  const cameraController = new SphericalController(camera, cameraTarget);
  cameraController.initCameraPosition(
    new Spherical(R, 0.0001, Math.PI * 2 * 12),
  );
  cameraController.initCameraShift(new Vector3(20, 0, 0));
  cameraController.duration = 1666;

  cameraController.addEventListener("moved_camera_complete", (e) => {
    console.log("Complete : ", e);
  });

  return cameraController;
};

const checkPlaying = (controller) => {
  setInterval(() => {
    console.log(controller.tweens.isPlaying());
  }, 100);
};

const initGUI = (controller) => {
  const gui = new GUI();
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
    },
  };

  gui.add(prop, "toggleRandomMove");
};

const stopRandomAnimation = (controller) => {
  controller.tweens.stop();
  clearInterval(randomAnimationID);
  randomAnimationID = null;
};

const startRandomAnimation = (controller) => {
  const move = () => {
    const to = new Spherical(
      R,
      // Math.random() * 70 + 35,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 6 - Math.PI * 3,
    );
    controller.move(to, {
      duration: 1500,
      easing: TWEEN.Easing.Cubic.Out,
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

  addPositionGUI("radius", +5, folder, controller);
  addPositionGUI("radius", -5, folder, controller);

  addPositionGUI("phi", +moveAngle, folder, controller);
  addPositionGUI("phi", -moveAngle, folder, controller);

  addPositionGUI("theta", +moveAngle, folder, controller);
  addPositionGUI("theta", -moveAngle, folder, controller);
};

const addPositionGUI = (type, value, folder, controller) => {
  const prop = {};
  let valString = value.toString();
  if (value > 0) valString = "+" + valString;
  const functionName = type + valString;
  prop[functionName] = () => {
    controller.addPosition(type, value);
  };
  folder.add(prop, functionName);
};

const initLoopGUI = (gui, controller) => {
  const folder = gui.addFolder("loop method");
  folder.open();

  addLoopGUI("radius", 30, 150, folder, controller);
  addLoopGUI("phi", 0, Math.PI, folder, controller);
  addLoopGUI("theta", -Math.PI / 4, Math.PI / 4, folder, controller);
};

const addLoopGUI = (type, min, max, folder, controller) => {
  let flag = false;
  const option = {
    duration: 10 * 1000,
  };

  const functionName = "loop_" + type;
  const prop = {};
  prop[functionName] = () => {
    if (flag) {
      controller.stopLoop(type);
    } else {
      controller.loop(type, min, max, option);
    }
    flag = !flag;
  };

  folder.add(prop, functionName);
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
window.onload = onDomContentsLoaded;
