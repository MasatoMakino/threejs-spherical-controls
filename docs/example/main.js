import {
  Scene,
  WebGLRenderer,
  AmbientLight,
  Color,
  BoxBufferGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  SpriteMaterial,
  TextureLoader
} from "three";

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

  render();
};

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
window.onload = onDomContentsLoaded;
