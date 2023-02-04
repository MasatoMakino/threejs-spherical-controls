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
    tweens.overrideTween(SphericalParamType.R, tween);
    expect(tweens.isPlaying()).toBeTruthy();
    expect(tweens.isPlayingWithKey(SphericalParamType.R)).toBeTruthy();
    expect(tweens.isPlayingWithKey(SphericalParamType.PHI)).toBeFalsy();

    tweens.stop();
    expect(tweens.isPlaying()).toBeFalsy();
  });
});
