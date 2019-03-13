import { Camera, EventDispatcher, Mesh, Spherical, Vector3 } from "three";
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
    private _camera;
    private _cameraTarget;
    private cameraShift;
    private tweenTarget;
    private tweenR;
    private tweenTheta;
    private tweenPhi;
    private tweenCameraShift;
    duration: number;
    easing: (amount: number) => number;
    loopEasing: (amount: number) => number;
    private pos;
    private static readonly EPS;
    phiMin: number;
    phiMax: number;
    thetaMin: number;
    thetaMax: number;
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
     * @param option
     */
    move(pos: Spherical, option?: EasingOption): void;
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
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param option
     */
    loopMoveR(min: number, max: number, option?: EasingOption): void;
    stopLoopMoveR(): void;
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
    private getFirstDuration;
    stopLoopMovePhi(): void;
    loopMoveTheta(min: number, max: number, option?: EasingOption): void;
    stopLoopMoveTheta(): void;
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
    private limitPhi;
    private limitTheta;
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    pauseTween(): void;
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying(): boolean;
    /**
     * 指定されたtweenを停止する。
     * @param {createjs.Tween | null} tween
     * @return {null}
     */
    private static removeTween;
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param from
     * @param to
     * @returns {number}    最短距離での目標となる回転角
     */
    static getTweenTheta(from: number, to: number): number;
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * Math.PIもしくは-Math.PIを入力すると正負が反転する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    static PI2ToPI(value: number): number;
}
/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export declare class EasingOption {
    duration?: number;
    easing?: Function;
    normalize?: boolean;
    static init(option: EasingOption, controller: SphericalController, isLoop?: boolean): EasingOption;
}
//# sourceMappingURL=SphericalController.d.ts.map