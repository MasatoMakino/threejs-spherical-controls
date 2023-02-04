import { SphericalController } from "../src";
import { Camera, Mesh } from "three";

describe("SphericalController", () => {
  test("constructor", () => {
    const controller = new SphericalController(new Camera(), new Mesh());
    expect(controller).toBeTruthy();
  });
});
