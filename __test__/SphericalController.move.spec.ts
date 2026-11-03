import { describe, test, expect, beforeEach } from "vitest";
import { SphericalController, type SphericalParamType } from "../src/index.js";
import { PerspectiveCamera, Mesh } from "three";
import { Easing } from "@tweenjs/tween.js";
import { RAFTicker } from "@masatomakino/raf-ticker";

describe("movePosition", () => {
  beforeEach(() => {
    RAFTicker.stop();
    RAFTicker.emitTickEvent(0);
  });

  const testLinear = (
    controller: SphericalController,
    key: SphericalParamType,
    from: number,
    to: number,
  ) => {
    const expectRate = (time: number, rate: number) => {
      RAFTicker.emitTickEvent(time);
      expect(controller.cloneSphericalPosition()[key]).toBeCloseTo(
        from * (1 - rate) + to * rate,
      );
    };
    expectRate(100, 0.1);
    expectRate(500, 0.5);
    expectRate(1000, 1.0);
  };

  test("movePosition interpolates one parameter from the current value to the target over the duration", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.movePosition("radius", 2.0, {
      duration: 1000,
      easing: Easing.Linear.None,
      startTime: 0,
    });
    testLinear(controller, "radius", 1.0, 2.0);

    controller.dispose();
  });

  test("movePosition with normalize false rotates theta through the full difference, including extra turns", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.addPosition("theta", Math.PI * 10);

    controller.movePosition("theta", Math.PI, {
      duration: 1000,
      easing: Easing.Linear.None,
      normalize: false,
      startTime: 0,
    });
    testLinear(controller, "theta", Math.PI * 10, Math.PI);

    controller.dispose();
  });

  test("move interpolates the camera to the given spherical position over the duration", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.addPosition("theta", 1.0);
    const from = controller.cloneSphericalPosition();
    const to = controller.cloneSphericalPosition();
    to.theta = Math.PI;

    controller.move(to, {
      duration: 1000,
      easing: Easing.Linear.None,
      startTime: 0,
    });
    testLinear(controller, "theta", from.theta, to.theta);

    controller.dispose();
  });

  test("movePosition with normalize true rotates theta along the shortest path after extra turns", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.addPosition("theta", Math.PI * 10);

    controller.movePosition("theta", Math.PI / 2, {
      duration: 1000,
      easing: Easing.Linear.None,
      normalize: true,
      startTime: 0,
    });
    testLinear(controller, "theta", Math.PI * 10, Math.PI * 10 + Math.PI / 2);

    controller.dispose();
  });
});
