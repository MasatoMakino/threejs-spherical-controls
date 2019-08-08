import { Camera, EventDispatcher, Mesh, Spherical, Vector3 } from "three";
import { EasingOption } from "./EasingOption";
import { CameraPositionLimiter } from "./CameraPositionLimiter";
import { SphericalControllerTween } from "./SphericalControllerTween";
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
export declare class SphericalController extends EventDispatcher {
    private cameraUpdater;
    private _cameraTarget;
    private pos;
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
     * 半径のみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveR(value: number, option?: EasingOption): void;
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value: Vector3, option?: EasingOption): void;
    /**
     * 経度のみを移動する
     * 横向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    moveTheta(value: number, option?: EasingOption): void;
    private getTweenPosition;
    private onCompleteCameraTween;
    /**
     * 緯度のみを移動する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    movePhi(value: number, option?: EasingOption): void;
    /**
     * 緯度のみをループで移動させる。
     * 縦方向にゆらゆらと回転させるための処理
     * @param {number} min　単位はラジアン角
     * @param {number} max　単位はラジアン角
     * @param option
     */
    loopMovePhi(min: number, max: number, option?: EasingOption): void;
    loopMoveTheta(min: number, max: number, option?: EasingOption): void;
    /**
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param option
     */
    loopMoveR(min: number, max: number, option?: EasingOption): void;
    stopLoopMoveR(): void;
    stopLoopMovePhi(): void;
    stopLoopMoveTheta(): void;
    private loop;
    private static getFirstDuration;
    /**
     * カメラシフトを移動する
     * @param value 移動先
     * @param option
     */
    moveCameraShift(value: Vector3, option?: EasingOption): void;
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value: number, overrideTween?: boolean): void;
    /**
     * カメラターゲットの座標を加算する。
     * 水平、垂直移動などに使用
     * @param pos
     * @param overrideTween
     */
    addTargetPosition(pos: Vector3, overrideTween?: boolean): void;
    /**
     * 経度を加算する。
     * 横方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addTheta(value: number, overrideTween?: boolean): void;
    /**
     * 緯度を加算する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addPhi(value: number, overrideTween?: boolean): void;
    /**
     * カメラのSpherical座標に加算する。
     * @param targetParam
     * @param value
     * @param overrideTween
     */
    private addPosition;
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    stop(): void;
}
//# sourceMappingURL=SphericalController.d.ts.map