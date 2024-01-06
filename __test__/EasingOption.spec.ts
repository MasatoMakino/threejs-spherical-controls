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
    EasingOption.init(option, controller);
    expect(option.normalize).toBe(true);
    expect(option.duration).toBe(controller.tweens.duration);
    expect(option.easing).toBe(controller.tweens.easing);
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
