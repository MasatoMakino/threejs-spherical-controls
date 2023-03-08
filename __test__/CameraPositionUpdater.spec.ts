import { Camera, EventDispatcher, Mesh, Spherical, Vector3 } from "three";
import {
  CameraPositionUpdater,
  CameraUpdateEvent,
  CameraUpdateEventType,
  SphericalControllerEvent,
  SphericalControllerEventType,
} from "../src";
import { RAFTicker } from "@masatomakino/raf-ticker";

describe("CameraPositionUpdater", () => {
  test("update", () => {
    const camera = new Camera();
    const parent = new EventDispatcher<
      CameraUpdateEvent | SphericalControllerEvent
    >();
    const onUpdateCamera = jest.fn();
    parent.addEventListener("moved_camera", onUpdateCamera);
    const updater = new CameraPositionUpdater(parent, camera);

    const newPosition = new Spherical();
    const e = new CameraUpdateEvent(
      "update",
      new Mesh(),
      newPosition,
      new Vector3()
    );
    parent.dispatchEvent(e);
    RAFTicker.emitTickEvent(0);

    expect(onUpdateCamera).toBeCalled();
  });
});
