import { Camera, Vector3, EventDispatcher, Mesh, Spherical } from "three";
/**
 * 球面座標系でカメラ位置をコントロールするクラス。
 *
 * カメラ位置はThetaおよびPhiで決定される。
 * 0, 0の場合北極上にカメラが位置する。
 * Phi : -Math.PI/2 ~ Math.PI/2 (縦回転)
 * Theta : -Math.PI ~ Math.PI (横回転)
 * の範囲で可動する。
 */
export declare class SphericalController extends EventDispatcher {
    private _camera;
    private _cameraTarget;
    private cameraShift;
    private tweenTarget;
    private tweenR;
    private tweenTheta;
    private tweenPhi;
    private tweenCameraShift;
    private isMoving;
    private static tweenDuration;
    private static tweenFunc;
    private static loopTweenFunc;
    private pos;
    phiLimitMin: number;
    phiLimitMax: number;
    protected isUpdate: boolean;
    /**
     * コンストラクタ
     * @param camera
     * @param target
     */
    constructor(camera: Camera, target: Mesh);
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
     * @param normalize 回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
     */
    move(pos: Spherical, normalize?: boolean): void;
    /**
     * tweenによる更新フラグ処理
     * @param e
     */
    private setNeedUpdate;
    /**
     * カメラ位置および注視点の更新処理
     */
    private updatePosition;
    /**
     * カメラターゲットの変更
     * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。
     * @param _target
     */
    changeTarget(_target: Mesh): void;
    /**************
     * 特定パラメーターのみ移動
     **************/
    /**
     * 半径のみを移動する
     * @param value 単位はラジアン角
     */
    moveR(value: number): void;
    /**
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param {number} duration　往復の片道にかかる時間
     */
    loopMoveR(min: number, max: number, duration: number): void;
    stopLoopMoveR(): void;
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     */
    moveTarget(value: Vector3): void;
    /**
     * 経度のみを移動する
     * 横向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param normalize 回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
     */
    moveTheta(value: number, normalize?: boolean): void;
    /**
     * 緯度のみを移動する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     */
    movePhi(value: number): void;
    /**
     * 緯度のみをループで移動させる。
     * 縦方向にゆらゆらと回転させるための処理
     * @param {number} min　単位はラジアン角
     * @param {number} max　単位はラジアン角
     * @param {number} duration　往復の片道にかかる時間
     */
    loopMovePhi(min: number, max: number, duration: number): void;
    stopLoopMovePhi(): void;
    /**
     * カメラシフトを移動する
     * @param value 移動先
     */
    moveCameraShift(value: Vector3): void;
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value: number, overrideTween?: boolean): void;
    /**
     * カメラターゲットの位置を移動する。
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
    private limitPhi;
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    private pauseTween;
    /**
     * 指定されたtweenを停止する。
     * @param {createjs.Tween | null} tween
     * @return {null}
     */
    private static removeTween;
    /**
     * tweenのコンプリートイベントハンドラ
     * カメラ移動が終了したことを示すイベントを発行する。
     */
    private onCompleteMove;
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param fromRotation　   現状の回転角度　単位ラジアン
     * @param toRotation      移動目標となる回転角度　単位ラジアン
     * @returns {number}    最短距離での目標となる回転角
     */
    static getTweenTheta(from: number, to: number): number;
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    private static PI2ToPI;
}
//# sourceMappingURL=SphericalController.d.ts.map