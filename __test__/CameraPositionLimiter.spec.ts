import { describe, expect, test } from "vitest";
import { CameraPositionLimiter, SphericalParamType } from "../src/index.js";
import { Spherical } from "three";

describe("CameraPositionLimiter", () => {
  test("clamp", () => {
    const limit = (
      type: SphericalParamType,
      max: number = 1.0,
      min: number = 0.0,
    ) => {
      const limiter = new CameraPositionLimiter();
      const spherical = new Spherical();
      limiter.setLimit(type, max, min);

      spherical[type] = Number.POSITIVE_INFINITY;
      limiter.clampPosition(type, spherical);
      expect(spherical[type]).toBe(max);

      spherical[type] = Number.NEGATIVE_INFINITY;
      limiter.clampPosition(type, spherical);
      expect(spherical[type]).toBe(min);
    };

    limit("radius");
    limit("theta");
    limit("phi");
  });
});
