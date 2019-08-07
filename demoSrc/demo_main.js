import {
  Scene,
  WebGLRenderer,
  AmbientLight,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  Spherical,
  AxesHelper,
  Vector3
} from "three/src/Three";
import {
  SphericalController,
  SphericalControllerUtil,
  SphericalControllerEventType
} from "../bin";

const W = 1280;
const H = 800;
let renderer;
let scene;
let camera;

const onDomContentsLoaded = () => {
  // シーンを作成
  scene = new Scene();
  camera = new PerspectiveCamera(45, W / H, 1, 400);
  camera.position.set(0, 0, 100);
  scene.add(camera);

  const renderOption = {
    canvas: document.getElementById("webgl-canvas"),
    antialias: true
  };
  renderer = new WebGLRenderer(renderOption);
  renderer.setClearColor(new Color(0x000000));
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);

  //平行光源オブジェクト(light)の設定
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  testPI2();

  scene.add(new AxesHelper(25));
  initCube();
  const target = initTarget();
  initController(target);

  render();
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

const initCube = () => {
  const size = 5;
  const geometry = new BoxGeometry(size, size, size);
  const material = [
    new MeshBasicMaterial({ color: 0x00ff00 }),
    new MeshBasicMaterial({ color: 0xff0000 }),
    new MeshBasicMaterial({ color: 0x0000ff }),
    new MeshBasicMaterial({ color: 0x00ff00 }),
    new MeshBasicMaterial({ color: 0xff0000 }),
    new MeshBasicMaterial({ color: 0x0000ff })
  ];
  const cube = new Mesh(geometry, material);
  scene.add(cube);
};

const initTarget = () => {
  const geo = new SphereGeometry(1);
  const cameraTarget = new Mesh(geo);
  scene.add(cameraTarget);
  return cameraTarget;
};

let cameraController;
const initController = cameraTarget => {
  const R = 105;
  cameraController = new SphericalController(camera, cameraTarget);
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
  setInterval(() => {
    const to = new Spherical(
      R,
      // Math.random() * 70 + 35,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 6 - Math.PI * 3
    );
    cameraController.move(to, {
      duration: 1500,
      easing: createjs.Ease.cubicOut
    });
    console.log("Start : ", to);
  }, 2000);

  setInterval(() => {
    console.log(cameraController.isPlaying());
  }, 100);
};

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
window.onload = onDomContentsLoaded;
