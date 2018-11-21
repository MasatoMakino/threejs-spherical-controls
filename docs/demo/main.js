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
} from "three";
import { SphericalController } from "../../bin/SphericalController";

const W = 1920;
const H = 1080;
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
  scene.add(new AxesHelper(25));
  initCube();
  const target = initTarget();
  initController(target);

  render();
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
  cameraController.initCameraPosition(new Spherical(R, 0, 0));
  cameraController.initCameraShift(new Vector3(20, 0, 0));

  setInterval(() => {
    const to = new Spherical(
      // R + Math.random() * 50 - 25,
      R,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 20
    );
    cameraController.move(to);
    console.log(to);
  }, 3000);
};

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
window.onload = onDomContentsLoaded;
