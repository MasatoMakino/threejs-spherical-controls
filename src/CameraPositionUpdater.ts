import { type Camera, Vector3 } from "three";
import type {
  CameraUpdateEvent,
  SphericalControllerEventMap,
  CameraUpdateEventMap,
} from "./index.js";
import { RAFTicker } from "@masatomakino/raf-ticker";
import type EventEmitter from "eventemitter3";

export class CameraPositionUpdater {
  private isUpdate = false;
  private dispatcher: EventEmitter<
    CameraUpdateEventMap | SphericalControllerEventMap
  >;
  private _camera: Camera;
  private updateEvent?: CameraUpdateEvent;

  constructor(
    parent: EventEmitter<CameraUpdateEventMap | SphericalControllerEventMap>,
    camera: Camera,
  ) {
    this.dispatcher = parent;
    this._camera = camera;

    this.dispatcher.on("update", this.setNeedUpdate);

    RAFTicker.on("onBeforeTick", () => {
      this.updatePosition();
    });
  }

  /**
   * tweenによる更新フラグ処理
   * イベントハンドラーで処理できるように関数とする。
   * @param e
   */
  private setNeedUpdate = (e: CameraUpdateEvent) => {
    this.updateEvent = e;
  };

  /**
   * カメラ位置および注視点の更新処理
   */
  private updatePosition = () => {
    if (!this.updateEvent) return;

    const e = this.updateEvent;

    const cameraTargetPos = new Vector3();
    const cameraPos = this._camera.position;
    cameraPos.setFromSpherical(e.position);
    cameraPos.add(e.cameraTarget.getWorldPosition(cameraTargetPos));
    this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    this._camera.lookAt(e.cameraTarget.getWorldPosition(cameraTargetPos));

    if (e.shift) {
      const pos: Vector3 = this._camera.position.clone();
      const move: Vector3 = new Vector3(e.shift.x, e.shift.y, e.shift.z);
      move.applyEuler(this._camera.rotation.clone());
      pos.add(move);
      this._camera.position.set(pos.x, pos.y, pos.z);
    }

    this.dispatcher.emit("moved_camera", {
      type: "moved_camera",
    });
    this.updateEvent = undefined;
  };

  dispose() {
    this.dispatcher.off("update", this.setNeedUpdate);
    RAFTicker.off("onBeforeTick", this.updatePosition);
  }
}
