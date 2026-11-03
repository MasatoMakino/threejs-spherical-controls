import { describe, expect, test, vi } from "vitest";
import { PerspectiveCamera, Mesh, Spherical, Vector3 } from "three";
import {
  CameraPositionUpdater,
  type CameraUpdateEvent,
  type CameraUpdateEventMap,
  type SphericalControllerEventMap,
} from "../src/index.js";
import { RAFTicker } from "@masatomakino/raf-ticker";
import EventEmitter from "eventemitter3";

describe("CameraPositionUpdater", () => {
  const initCameraPositionUpdater = () => {
    const camera = new PerspectiveCamera();
    const parent = new EventEmitter<
      CameraUpdateEventMap | SphericalControllerEventMap
    >();
    const onUpdateCamera = vi.fn();
    parent.on("moved_camera", onUpdateCamera);
    new CameraPositionUpdater(parent, camera);

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

  test("an update event emits moved_camera once on the next tick, not before it and not again", () => {
    const { parent, onUpdateCamera } = initCameraPositionUpdater();
    const e = generateCameraUpdateEvent();
    parent.emit(e.type, e);

    expect(onUpdateCamera).not.toBeCalled();

    RAFTicker.emitTickEvent(0);
    expect(onUpdateCamera).toBeCalled();

    onUpdateCamera.mockClear();
    RAFTicker.emitTickEvent(1);
    expect(onUpdateCamera).not.toBeCalled();
  });
});
