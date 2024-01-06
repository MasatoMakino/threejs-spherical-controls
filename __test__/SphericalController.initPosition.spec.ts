import { describe, expect, test, vi } from "vitest";
import { SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh, Spherical, Vector3 } from "three";

describe("initPosition", () => {
  const EPS = 0.000001;

  test("initPosition", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.initCameraPosition(new Spherical());
    expect(controller.cloneSphericalPosition()).toStrictEqual(
      new Spherical(1, EPS, 0),
    );
  });

  test("Arguments of initPosition should not affect cameraPosition.", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const pos = new Spherical(100, 1, -1);
    const originalPos = pos.clone();

    controller.initCameraPosition(pos);
    expect(controller.cloneSphericalPosition()).toStrictEqual(originalPos);

    pos.set(150, 0, 0);
    expect(controller.cloneSphericalPosition()).toStrictEqual(originalPos);
  });

  test("init camera position and target position", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    const onUpdate = vi.fn();
    controller.on("update", onUpdate);

    const targetPos = new Vector3(0, 10, 0);
    controller.initCameraPosition(new Spherical(), targetPos);

    expect(onUpdate).toBeCalled();
    expect(onUpdate.mock.calls[0][0].cameraTarget.position).toStrictEqual(
      targetPos,
    );
  });

  test("limit position", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.initCameraPosition(
      new Spherical(Number.POSITIVE_INFINITY, 1000, 1000),
    );
    expect(controller.cloneSphericalPosition()).toStrictEqual(
      new Spherical(Number.MAX_VALUE, Math.PI - EPS, 1000),
    );
  });
});
