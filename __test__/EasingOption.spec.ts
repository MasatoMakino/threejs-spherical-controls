import { describe, expect, test } from "vitest";
import { EasingOption, SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh } from "three";

describe("EasingOption", () => {
  test("init fills unset options with the controller defaults and does not mutate the argument", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const option = new EasingOption();
    const result = EasingOption.init(option, controller);
    expect(result.normalize).toBe(true);
    expect(result.duration).toBe(controller.tweens.duration);
    expect(result.easing).toBe(controller.tweens.easing);

    expect(option).not.toBe(result);
    expect(option.normalize).toBeUndefined();
    expect(option.duration).toBeUndefined();
    expect(option.easing).toBeUndefined();
  });
});
