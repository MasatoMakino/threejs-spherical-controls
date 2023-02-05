import {
  CameraUpdateEventType,
  SphericalController,
  SphericalParamType,
} from "../src";
import { Camera, Mesh } from "three";
import TWEEN, { Easing } from "@tweenjs/tween.js";

describe("loop", () => {
  beforeEach(() => {
    TWEEN.removeAll();
    TWEEN.update(0);
  });

  test("loop", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    const callback = jest.fn();
    controller.addEventListener(CameraUpdateEventType.UPDATE, callback);
    controller.loop(SphericalParamType.R, -1, 1, {
      easing: Easing.Linear.None,
      duration: 1000,
      startTime: 0,
    });

    TWEEN.update(100);
    expect(callback).toBeCalled();
    callback.mockReset();

    TWEEN.update(1000);
    expect(callback).toBeCalled();
  });
});
