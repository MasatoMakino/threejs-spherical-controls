import { Vector3, EventDispatcher, Camera, Mesh } from "three";
import {
  SphericalControllerEvent,
  SphericalControllerEventType
} from "./SphericalControllerEvent";

import { CameraUpdateEvent, CameraUpdateEventType } from "./CameraUpdateEvent";
import { RAFTicker, RAFTickerEventType, RAFTickerEvent } from "raf-ticker";

export class CameraPositionUpdater {
  private isUpdate: boolean = false;
  private dispatcher: EventDispatcher;
  private _camera: Camera;
  private updateEvent: CameraUpdateEvent;

  constructor(parent: EventDispatcher, camera: Camera, target: Mesh) {
    this.dispatcher = parent;
    this._camera = camera;

    this.dispatcher.addEventListener(
      CameraUpdateEventType.UPDATE,
      this.setNeedUpdate
    );

    RAFTicker.addEventListener(
      RAFTickerEventType.onBeforeTick,
      (e: RAFTickerEvent) => {
        this.updatePosition();
      }
    );
  }

  /**
   * tweenによる更新フラグ処理
   * イベントハンドラーで処理できるように関数とする。
   * @param e
   */
  private setNeedUpdate = (e: CameraUpdateEvent) => {
    this.isUpdate = true;
    this.updateEvent = e;
  };

  /**
   * カメラ位置および注視点の更新処理
   */
  private updatePosition = () => {
    if (!this.isUpdate) return;
    this.isUpdate = false;

    const e = this.updateEvent;

    let cameraTargetPos = new Vector3();
    let cameraPos = this._camera.position;
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

    this.dispatcher.dispatchEvent(
      new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA)
    );
  };
}
