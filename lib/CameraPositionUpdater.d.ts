import { EventDispatcher, Camera, Mesh } from "three";
import { SphericalControllerEvent } from "./SphericalControllerEvent";
import { CameraUpdateEvent } from "./CameraUpdateEvent";
export declare class CameraPositionUpdater {
    private isUpdate;
    private dispatcher;
    private _camera;
    private updateEvent;
    constructor(parent: EventDispatcher<CameraUpdateEvent | SphericalControllerEvent>, camera: Camera, target: Mesh);
    /**
     * tweenによる更新フラグ処理
     * イベントハンドラーで処理できるように関数とする。
     * @param e
     */
    private setNeedUpdate;
    /**
     * カメラ位置および注視点の更新処理
     */
    private updatePosition;
}
//# sourceMappingURL=CameraPositionUpdater.d.ts.map