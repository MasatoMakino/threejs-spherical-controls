import {
  PerspectiveCamera,
  EventDispatcher,
  Mesh,
  Spherical,
  Vector3,
} from "three";
import {
  CameraPositionUpdater,
  CameraUpdateEvent,
  SphericalControllerEvent,
} from "../src/index.js";
import { RAFTicker } from "@masatomakino/raf-ticker";

describe("CameraPositionUpdater", () => {
  const initCameraPositionUpdater = () => {
    const camera = new PerspectiveCamera();
    const parent = new EventDispatcher<
      CameraUpdateEvent | SphericalControllerEvent
    >();
    const onUpdateCamera = jest.fn();
    parent.addEventListener("moved_camera", onUpdateCamera);
    const updater = new CameraPositionUpdater(parent, camera);

    return { parent, onUpdateCamera };
  };

  const generateCameraUpdateEvent = () => {
    const newPosition = new Spherical();
    const e: CameraUpdateEvent = {
      type: "update",
      cameraTarget: new Mesh(),
      position: newPosition,
      shift: new Vector3(),
    };
    return e;
  };

  test("update", () => {
    const { parent, onUpdateCamera } = initCameraPositionUpdater();
    const e = generateCameraUpdateEvent();
    parent.dispatchEvent(e);

    //rafが呼び出されるまでは、cameraの移動は発生しない。
    expect(onUpdateCamera).not.toBeCalled();

    //rafが呼び出されたら、レンダリングの前にカメラが移動する。
    RAFTicker.emitTickEvent(0);
    expect(onUpdateCamera).toBeCalled();

    //カメラ移動後に、rafが呼び出されても、カメラは移動しない。
    onUpdateCamera.mockClear();
    RAFTicker.emitTickEvent(1);
    expect(onUpdateCamera).not.toBeCalled();
  });
});
