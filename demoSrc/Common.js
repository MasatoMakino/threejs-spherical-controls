import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";

export class Common {
  static initCamera(scene, W, H) {
    const camera = new PerspectiveCamera(45, W / H, 1, 400);
    camera.position.set(0, 0, 100);
    scene.add(camera);
    return camera;
  }

  static initLight(scene) {
    const ambientLight = new AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    return ambientLight;
  }

  static initHelper(scene, size = 30) {
    const axesHelper = new AxesHelper(size);
    scene.add(axesHelper);
  }

  static initCube(scene, size = 5) {
    const generateMaterial = (color) => {
      return new MeshBasicMaterial({
        color,
        opacity: 0.5,
        transparent: true,
        wireframe: true,
      });
    };
    const geometry = new BoxGeometry(size, size, size);
    const material = [
      generateMaterial(0x00ff00),
      generateMaterial(0xff0000),
      generateMaterial(0x0000ff),
      generateMaterial(0x00ff00),
      generateMaterial(0xff0000),
      generateMaterial(0x0000ff),
    ];
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    return cube;
  }

  static initRenderer(
    W,
    H,
    color = 0x000000,
    id = "webgl-canvas",
    antialias = true
  ) {
    const element = document.getElementById(id);
    element.style.zIndex = 0;
    element.style.position = "absolute";
    const renderer = new WebGLRenderer({
      canvas: element,
      antialias: antialias,
    });
    renderer.setClearColor(new Color(color));
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }

  static render(renderer, scene, camera) {
    const rendering = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(rendering);
    };
    rendering();
  }
}
