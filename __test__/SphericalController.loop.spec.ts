import { SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh } from "three";
import TWEEN, { Easing } from "@tweenjs/tween.js";
import { RAFTicker } from "@masatomakino/raf-ticker";

describe("loop", () => {
  beforeEach(() => {
    TWEEN.removeAll();
    RAFTicker.stop();
    RAFTicker.emitTickEvent(0);
  });

  test("loop", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const callback = jest.fn();
    controller.on("update", callback);
    controller.loop("radius", 0, 1, {
      easing: Easing.Linear.None,
      duration: 1000,
      startTime: 0,
    });

    const testLoopPosition = (time: number, position: number) => {
      RAFTicker.emitTickEvent(time);
      expect(callback).toBeCalled();
      const lastCallbackArgs = callback.mock.calls.at(-1)[0];
      expect(lastCallbackArgs.position["radius"]).toBeCloseTo(position);
      expect(controller.cloneSphericalPosition()["radius"]).toBeCloseTo(
        position,
      );
      callback.mockReset();
    };

    testLoopPosition(0, 1);
    testLoopPosition(500, 0.5);
    testLoopPosition(1000, 0);
    testLoopPosition(1100, 0.1);
  });
});
