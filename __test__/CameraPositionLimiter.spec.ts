import { describe, expect, test } from "vitest";
import {
  CameraPositionLimiter,
  type SphericalParamType,
} from "../src/index.js";
import { Spherical } from "three";

describe("CameraPositionLimiter", () => {
  test("clampPosition clamps radius, theta, and phi to the range set by setLimit", () => {
    const limit = (type: SphericalParamType, max = 1.0, min = 0.0) => {
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
