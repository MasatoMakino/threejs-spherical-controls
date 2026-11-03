import { describe, expect, test, vi } from "vitest";
import { SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh, Spherical, Vector3 } from "three";

describe("initPosition", () => {
  test("initCameraPosition copies the argument, so later changes to it do not move the camera", () => {
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

  test("initCameraPosition with a target position emits update with the moved camera target", () => {
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

  test("initCameraPosition clamps radius and phi to the default limits and leaves theta unbounded", () => {
    const controller = new SphericalController(
      new PerspectiveCamera(),
      new Mesh(),
    );
    controller.initCameraPosition(
      new Spherical(Number.POSITIVE_INFINITY, 1000, 1000),
    );
    const { rMax, phiMax } = controller.limiter;
    expect(controller.cloneSphericalPosition()).toStrictEqual(
      new Spherical(rMax, phiMax, 1000),
    );
  });
});
