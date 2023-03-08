import { SphericalControllerTween, SphericalParamType } from "../src";
import { Tween } from "@tweenjs/tween.js";
import { Vector3 } from "three";

describe("SphericalControllerTween", () => {
  test("constructor", () => {
    const tweens = new SphericalControllerTween();
    expect(tweens).toBeTruthy();
    expect(tweens.isPlaying()).toBeFalsy();
  });

  test("override and stop", () => {
    const tweens = new SphericalControllerTween();
    const tween = new Tween<Vector3>(new Vector3())
      .to(new Vector3(), 1000)
      .start(0);
    tweens.overrideTween("radius", tween);
    expect(tweens.isPlaying()).toBeTruthy();
    expect(tweens.isPlayingWithKey("radius")).toBeTruthy();
    expect(tweens.isPlayingWithKey("phi")).toBeFalsy();

    tweens.stop();
    expect(tweens.isPlaying()).toBeFalsy();
  });
});
