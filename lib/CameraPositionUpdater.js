"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraPositionUpdater = void 0;
const three_1 = require("three");
const SphericalControllerEvent_1 = require("./SphericalControllerEvent");
const CameraUpdateEvent_1 = require("./CameraUpdateEvent");
const raf_ticker_1 = require("raf-ticker");
class CameraPositionUpdater {
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
            const cameraTargetPos = new three_1.Vector3();
            const cameraPos = this._camera.position;
            cameraPos.setFromSpherical(e.position);
            cameraPos.add(e.cameraTarget.getWorldPosition(cameraTargetPos));
            this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
            this._camera.lookAt(e.cameraTarget.getWorldPosition(cameraTargetPos));
            if (e.shift) {
                const pos = this._camera.position.clone();
                const move = new three_1.Vector3(e.shift.x, e.shift.y, e.shift.z);
                move.applyEuler(this._camera.rotation.clone());
                pos.add(move);
                this._camera.position.set(pos.x, pos.y, pos.z);
            }
            this.dispatcher.dispatchEvent(new SphericalControllerEvent_1.SphericalControllerEvent(SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA));
        };
        this.dispatcher = parent;
        this._camera = camera;
        this.dispatcher.addEventListener(CameraUpdateEvent_1.CameraUpdateEventType.UPDATE, this.setNeedUpdate);
        raf_ticker_1.RAFTicker.on(raf_ticker_1.RAFTickerEventType.onBeforeTick, (e) => {
            this.updatePosition();
        });
    }
}
exports.CameraPositionUpdater = CameraPositionUpdater;
