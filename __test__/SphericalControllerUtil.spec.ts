import { describe, expect, test } from "vitest";
import {
  PI2ToPI,
  generateCameraTarget,
  getFirstDuration,
  getTweenTheta,
} from "../src/index.js";
import type { MeshBasicMaterial } from "three";

describe("SphericalControllerUtil", () => {
  test("PI2ToPI normalizes an angle to the range from -PI to PI", () => {
    expect(PI2ToPI(0)).toBe(0);
    expect(PI2ToPI(Math.PI)).toBe(Math.PI);
    expect(PI2ToPI(Math.PI * 2)).toBeCloseTo(0);
  });

  test("generateCameraTarget returns a fully transparent mesh", () => {
    const target = generateCameraTarget();
    expect((target.material as MeshBasicMaterial).opacity).toBe(0.0);
  });

  test("getFirstDuration scales the duration by the distance from min to the current value within the range", () => {
    expect(getFirstDuration(1, 0, 1.0, 0)).toBe(0);
    expect(getFirstDuration(1, 0.5, 1.0, 0)).toBe(0.5);
    expect(getFirstDuration(1, 1.0, 1.0, 0)).toBe(1);

    expect(getFirstDuration(1, 0, 1.0, -1)).toBe(0.5);
    expect(getFirstDuration(1, 0.5, 1.0, -1)).toBe(0.75);
    expect(getFirstDuration(1, 1.0, 1.0, -1)).toBe(1);
  });

  test("getFirstDuration returns 0 when max equals min, to avoid division by zero", () => {
    expect(getFirstDuration(1, 5, 10, 10)).toBe(0);
    expect(getFirstDuration(2, -5, -3, -3)).toBe(0);
  });

  test("getTweenTheta returns the target angle reached by the shortest rotation from the start angle", () => {
    const PI2 = Math.PI * 2;
    expect(getTweenTheta(0, 0.1)).toBe(0.1);
    expect(getTweenTheta(0, -0.1)).toBe(-0.1);

    expect(getTweenTheta(0, PI2 + 0.1)).toBeCloseTo(0.1);
    expect(getTweenTheta(0, PI2 - 0.1)).toBeCloseTo(-0.1);

    expect(getTweenTheta(PI2, 0.1)).toBeCloseTo(PI2 + 0.1);
    expect(getTweenTheta(PI2, -0.1)).toBeCloseTo(PI2 - 0.1);
  });
});
