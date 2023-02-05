import {
  CameraUpdateEventType,
  SphericalController,
  SphericalParamType,
} from "../src";
import { Camera, Mesh, Spherical } from "three";
import TWEEN from "@tweenjs/tween.js";

describe("SphericalController", () => {
  beforeEach(() => {
    TWEEN.removeAll();
    TWEEN.update(0);
  });

  test("constructor", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    expect(controller).toBeTruthy();
  });

  test("clone", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    expect(controller.cloneSphericalPosition()).toStrictEqual(
      new Spherical(1, 0, 0)
    );
  });

  test("copy", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    const target = new Spherical();
    controller.copySphericalPosition(target);
    expect(target).toStrictEqual(new Spherical(1, 0, 0));
  });

  describe("addPosition", () => {
    const initSpherical = () => {
      const controller = new SphericalController(new Camera(), new Mesh());
      const onMovedCamera = jest.fn();
      controller.addEventListener(CameraUpdateEventType.UPDATE, onMovedCamera);
      return { controller, onMovedCamera };
    };

    test("add", () => {
      const { controller, onMovedCamera } = initSpherical();
      controller.addPosition(SphericalParamType.THETA, 1.0);
      expect(onMovedCamera).toBeCalled();
      expect(controller.cloneSphericalPosition()).toMatchObject({ theta: 1.0 });
    });

    test("override tween", () => {
      const { controller, onMovedCamera } = initSpherical();
      controller.movePosition(SphericalParamType.R, 2.0, { startTime: 0 });

      controller.addPosition(SphericalParamType.THETA, 1.0, true);
      expect(onMovedCamera).toBeCalled();

      TWEEN.update(1000);
      expect(controller.cloneSphericalPosition()).toMatchObject({
        radius: 1.0,
      });
    });
  });
});
