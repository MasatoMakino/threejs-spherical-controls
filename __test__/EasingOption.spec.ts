import { describe, expect, test } from "vitest";
import { EasingOption, SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh } from "three";
import { Easing } from "@tweenjs/tween.js";

describe("EasingOption", () => {
  test("constructor", () => {
    const option = new EasingOption();
    expect(option).toBeTruthy();
  });

  test("init : default", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const option = new EasingOption();
    const result = EasingOption.init(option, controller);
    expect(result.normalize).toBe(true);
    expect(result.duration).toBe(controller.tweens.duration);
    expect(result.easing).toBe(controller.tweens.easing);

    // ensure the original argument remains untouched
    expect(option).not.toBe(result);
    expect(option.normalize).toBeUndefined();
    expect(option.duration).toBeUndefined();
    expect(option.easing).toBeUndefined();
  });

  test("init : setting", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const option = new EasingOption();
    option.normalize = false;
    option.duration = 1000;
    option.easing = Easing.Bounce.Out;
    EasingOption.init(option, controller, true);
    expect(option.normalize).toBe(false);
    expect(option.duration).toBe(1000);
    expect(option.easing).toBe(Easing.Bounce.Out);
  });

  test("init : undefined", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const option = EasingOption.init(undefined, controller);
    expect(option).toBeTruthy();
  });
});
