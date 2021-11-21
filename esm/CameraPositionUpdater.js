import { Vector3 } from "three";
import { SphericalControllerEvent, SphericalControllerEventType, } from "./SphericalControllerEvent";
import { CameraUpdateEventType } from "./CameraUpdateEvent";
import { RAFTicker, RAFTickerEventType } from "raf-ticker";
export class CameraPositionUpdater {
    constructor(parent, camera) {
        this.isUpdate = false;
        /**
         * tweenによる更新フラグ処理
         * イベントハンドラーで処理できるように関数とする。
         * @param e
         */
        this.setNeedUpdate = (e) => {
            this.isUpdate = true;
            this.updateEvent = e;
        };
        /**
         * カメラ位置および注視点の更新処理
         */
        this.updatePosition = () => {
            if (!this.isUpdate)
                return;
            this.isUpdate = false;
            const e = this.updateEvent;
            const cameraTargetPos = new Vector3();
            const cameraPos = this._camera.position;
            cameraPos.setFromSpherical(e.position);
            cameraPos.add(e.cameraTarget.getWorldPosition(cameraTargetPos));
            this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
            this._camera.lookAt(e.cameraTarget.getWorldPosition(cameraTargetPos));
            if (e.shift) {
                const pos = this._camera.position.clone();
                const move = new Vector3(e.shift.x, e.shift.y, e.shift.z);
                move.applyEuler(this._camera.rotation.clone());
                pos.add(move);
                this._camera.position.set(pos.x, pos.y, pos.z);
            }
            this.dispatcher.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA));
        };
        this.dispatcher = parent;
        this._camera = camera;
        this.dispatcher.addEventListener(CameraUpdateEventType.UPDATE, this.setNeedUpdate);
        RAFTicker.on(RAFTickerEventType.onBeforeTick, (e) => {
            this.updatePosition();
        });
    }
}
