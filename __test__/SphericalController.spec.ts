import { describe, beforeEach, expect, test, vi } from "vitest";
import { SphericalController } from "../src/index.js";
import { PerspectiveCamera, Mesh } from "three";
import { RAFTicker } from "@masatomakino/raf-ticker";

describe("SphericalController", () => {
  beforeEach(() => {
    RAFTicker.stop();
    RAFTicker.emitTickEvent(0);
  });

  describe("addPosition", () => {
    const initSpherical = () => {
      const controller = new SphericalController(
        new PerspectiveCamera(),
        new Mesh(),
      );
      const onMovedCamera = vi.fn();
      controller.on("update", onMovedCamera);
      return { controller, onMovedCamera };
    };

    test("addPosition adds the value to the parameter and emits update", () => {
      const { controller, onMovedCamera } = initSpherical();
      controller.addPosition("theta", 1.0);
      expect(onMovedCamera).toBeCalled();
      expect(controller.cloneSphericalPosition()).toMatchObject({ theta: 1.0 });

      controller.dispose();
    });

    test("addPosition with overrideTween stops the running tweens and emits update", () => {
      const { controller, onMovedCamera } = initSpherical();
      controller.movePosition("radius", 2.0, { startTime: 0 });

      controller.addPosition("theta", 1.0, true);
      expect(onMovedCamera).toBeCalled();

      RAFTicker.emitTickEvent(1000);
      expect(controller.cloneSphericalPosition()).toMatchObject({
        radius: 1.0,
      });

      controller.dispose();
    });
  });
});
