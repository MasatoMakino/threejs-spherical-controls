import { SphericalControllerUtil } from "../src";

describe("SphericalControllerUtil", () => {
  test("PI2ToPI", () => {
    expect(SphericalControllerUtil.PI2ToPI(0)).toBe(0);
    expect(SphericalControllerUtil.PI2ToPI(Math.PI)).toBe(Math.PI);
    expect(SphericalControllerUtil.PI2ToPI(Math.PI * 2)).toBeCloseTo(0);
  });
});
