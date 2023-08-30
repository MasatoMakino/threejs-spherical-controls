import { Camera, EventDispatcher, Vector3 } from "three";
import { SphericalControllerEvent } from "./SphericalControllerEvent";
import { CameraUpdateEvent } from "./CameraUpdateEvent";
import { RAFTicker } from "@masatomakino/raf-ticker";

export class CameraPositionUpdater {
  private isUpdate: boolean = false;
  private dispatcher: EventDispatcher<
    CameraUpdateEvent | SphericalControllerEvent
  >;
  private _camera: Camera;
  private updateEvent?: CameraUpdateEvent;

  constructor(
    parent: EventDispatcher<CameraUpdateEvent | SphericalControllerEvent>,
    camera: Camera,
  ) {
    this.dispatcher = parent;
    this._camera = camera;

    this.dispatcher.addEventListener("update", this.setNeedUpdate);

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

    this.dispatcher.dispatchEvent({
      type: "moved_camera",
    });
    this.updateEvent = undefined;
  };
}
