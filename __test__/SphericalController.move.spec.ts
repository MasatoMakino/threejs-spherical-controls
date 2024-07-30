import { describe, test, expect, beforeEach } from "vitest";
import {
  SphericalController,
  SphericalParamType,
  TargetParam,
} from "../src/index.js";
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
    key: SphericalParamType | TargetParam,
    from: number,
    to: number,
  ) => {
    const generateObject = (rate: number) => {
      const obj: { [key: string]: number } = {};
      obj[key] = from * (1 - rate) + to * rate;
      return obj;
    };

    RAFTicker.emitTickEvent(100);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(0.1),
    );
    RAFTicker.emitTickEvent(500);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(0.5),
    );
    RAFTicker.emitTickEvent(1000);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(1.0),
    );
  };

  test("to", () => {
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

  test("not normalize", () => {
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

  test("move", () => {
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

  test("normalize", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.addPosition("theta", Math.PI * 10);

    controller.movePosition("theta", Math.PI, {
      duration: 1000,
      easing: Easing.Linear.None,
      normalize: true,
      startTime: 0,
    });

    RAFTicker.emitTickEvent(100);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI * 0.1,
    });
    RAFTicker.emitTickEvent(500);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI * 0.5,
    });
    RAFTicker.emitTickEvent(1000);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI,
    });

    controller.dispose();
  });
});
