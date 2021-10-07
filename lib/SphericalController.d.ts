import { Camera, EventDispatcher, Mesh, Spherical, Vector3 } from "three";
import { SphericalControllerEvent } from "./SphericalControllerEvent";
import { SphericalParamType } from "./TargetParam";
import { EasingOption } from "./EasingOption";
import { CameraPositionLimiter } from "./CameraPositionLimiter";
import { SphericalControllerTween } from "./SphericalControllerTween";
import { CameraUpdateEvent } from "./CameraUpdateEvent";
/**
 * 球面座標系でカメラ位置をコントロールするクラス。
 *
 * カメラ位置はThetaおよびPhiで決定される。
 * 0, 0の場合北極上にカメラが位置する。
 * Phi : 0 ~ Math.PI (縦回転)
 * Theta : -Math.PI ~ Math.PI (横回転)
 * の範囲で可動する。
 *
 * 北極南極を通過すると緯度も反転するため、このクラスでは南北90度以上の移動には対応していない。また、極点上空では座標が一意の値にならないため、Phi 0もしくはPIには対応していない。
 */
export declare class SphericalController extends EventDispatcher<CameraUpdateEvent | SphericalControllerEvent> {
    private cameraUpdater;
    private _cameraTarget;
    private pos;
    /**
     * 画面のシフト
     * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
     * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
     */
    private cameraShift;
    tweens: SphericalControllerTween;
    limiter: CameraPositionLimiter;
    /**
     * コンストラクタ
     * @param camera
     * @param target
     */
    constructor(camera: Camera, target: Mesh);
    dispatchUpdateEvent: () => void;
    /**
     * カメラ位置の初期設定を行う
     * @param pos
     * @param targetPos
     */
    initCameraPosition(pos: Spherical, targetPos?: Vector3): void;
    /**
     * カメラの位置ずれ設定を行う。
     * @param {Vector3} shift
     */
    initCameraShift(shift: Vector3): void;
    /**
     * カメラを任意の位置に移動する
     * @param pos
     * @param option
     */
    move(pos: Spherical, option?: EasingOption): void;
    /**
     * カメラターゲットの変更
     * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。
     * @param _target
     */
    changeTarget(_target: Mesh): void;
    /**
     * カメラ座標のうち、typeで指定された１つのパラメーターを移動する
     * @param type
     * @param value
     * @param option
     */
    movePosition(type: SphericalParamType, value: number, option?: EasingOption): void;
    /**
     * movePosition関数用のtweenオブジェクトを生成する。
     * @param targetParam
     * @param to
     * @param option
     */
    private getTweenPosition;
    /**
     * Tweenのcompleteイベントで呼び出される関数。
     * MOVED_CAMERA_COMPLETEイベントを発行する。
     * @param paramType
     */
    private onCompleteCameraTween;
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value: Vector3, option?: EasingOption): void;
    stopLoop(type: SphericalParamType): void;
    /**
     * カメラ位置をループで移動させる。
     * ゆらゆらと動かすための処理。
     * @param type どのプロパティを操作するか。
     * @param min
     * @param max
     * @param option このアニメーションに対する1回限りの設定を行う。
     */
    loop(type: SphericalParamType, min: number, max: number, option?: EasingOption): void;
    /**
     * カメラシフトを移動する
     * @param value 移動先
     * @param option
     */
    moveCameraShift(value: Vector3, option?: EasingOption): void;
    /**
     * カメラターゲットの座標を加算する。
     * 水平、垂直移動などに使用
     * @param pos
     * @param overrideTween
     */
    addTargetPosition(pos: Vector3, overrideTween?: boolean): void;
    /**
     * カメラのSpherical座標に加算する。
     * @param type
     * @param value
     * @param overrideTween
     */
    addPosition(type: SphericalParamType, value: number, overrideTween?: boolean): void;
}
//# sourceMappingURL=SphericalController.d.ts.map