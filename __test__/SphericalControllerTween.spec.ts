import { describe, expect, test } from "vitest";
import { SphericalControllerTween } from "../src/index.js";
import { Tween } from "@tweenjs/tween.js";
import { Vector3 } from "three";

describe("SphericalControllerTween", () => {
  test("overrideTween registers a playing tween for its key, and stop stops every tween", () => {
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
