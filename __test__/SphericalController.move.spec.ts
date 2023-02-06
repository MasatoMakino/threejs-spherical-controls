import { SphericalController, SphericalParamType } from "../src";
import { Camera, Mesh } from "three";
import TWEEN, { Easing } from "@tweenjs/tween.js";

describe("movePosition", () => {
  beforeEach(() => {
    TWEEN.removeAll();
    TWEEN.update(0);
  });

  const testLinear = (
    controller: SphericalController,
    key: string,
    from: number,
    to: number
  ) => {
    const generateObject = (rate: number) => {
      const obj = {};
      obj[key] = from * (1 - rate) + to * rate;
      return obj;
    };

    TWEEN.update(100);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(0.1)
    );
    TWEEN.update(500);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(0.5)
    );
    TWEEN.update(1000);
    expect(controller.cloneSphericalPosition()).toMatchObject(
      generateObject(1.0)
    );
  };

  test("to", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    controller.movePosition(SphericalParamType.R, 2.0, {
      duration: 1000,
      easing: Easing.Linear.None,
      startTime: 0,
    });
    testLinear(controller, SphericalParamType.R, 1.0, 2.0);
  });

  test("not normalize", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    controller.addPosition(SphericalParamType.THETA, Math.PI * 10);

    controller.movePosition(SphericalParamType.THETA, Math.PI, {
      duration: 1000,
      easing: Easing.Linear.None,
      normalize: false,
      startTime: 0,
    });
    testLinear(controller, SphericalParamType.THETA, Math.PI * 10, Math.PI);
  });

  test("move", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    controller.addPosition(SphericalParamType.THETA, 1.0);
    const from = controller.cloneSphericalPosition();
    const to = controller.cloneSphericalPosition();
    to.theta = Math.PI;

    controller.move(to, {
      duration: 1000,
      easing: Easing.Linear.None,
      startTime: 0,
    });
    testLinear(controller, SphericalParamType.THETA, from.theta, to.theta);
  });

  test("normalize", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    controller.addPosition(SphericalParamType.THETA, Math.PI * 10);

    controller.movePosition(SphericalParamType.THETA, Math.PI, {
      duration: 1000,
      easing: Easing.Linear.None,
      normalize: true,
      startTime: 0,
    });

    TWEEN.update(100);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI * 0.1,
    });
    TWEEN.update(500);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI * 0.5,
    });
    TWEEN.update(1000);
    expect(controller.cloneSphericalPosition()).toMatchObject({
      theta: Math.PI * 10 - Math.PI,
    });
  });
});
