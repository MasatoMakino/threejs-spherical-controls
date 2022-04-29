"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphericalController = void 0;
const tween_js_1 = require("@tweenjs/tween.js");
const tween_js_ticker_1 = require("tween.js-ticker");
const three_1 = require("three");
const three_2 = require("three");
const SphericalControllerEvent_1 = require("./SphericalControllerEvent");
const TargetParam_1 = require("./TargetParam");
const EasingOption_1 = require("./EasingOption");
const SphericalControllerUtil_1 = require("./SphericalControllerUtil");
const CameraPositionLimiter_1 = require("./CameraPositionLimiter");
const SphericalControllerTween_1 = require("./SphericalControllerTween");
const CameraPositionUpdater_1 = require("./CameraPositionUpdater");
const CameraUpdateEvent_1 = require("./CameraUpdateEvent");
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
class SphericalController extends three_1.EventDispatcher {
    /**
     * コンストラクタ
     * @param camera
     * @param target
     */
    constructor(camera, target) {
        var _a;
        var _b;
        super();
        this.pos = new three_1.Spherical();
        /**
         * 画面のシフト
         * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
         * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
         */
        this.cameraShift = new three_1.Vector3();
        this.tweens = new SphericalControllerTween_1.SphericalControllerTween();
        this.limiter = new CameraPositionLimiter_1.CameraPositionLimiter();
        this.dispatchUpdateEvent = () => {
            const e = new CameraUpdateEvent_1.CameraUpdateEvent(CameraUpdateEvent_1.CameraUpdateEventType.UPDATE, this._cameraTarget, this.pos, this.cameraShift);
            this.dispatchEvent(e);
        };
        this._cameraTarget = target;
        (_a = (_b = this._cameraTarget).material) !== null && _a !== void 0 ? _a : (_b.material = new three_2.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.0,
            transparent: true,
        }));
        this.cameraUpdater = new CameraPositionUpdater_1.CameraPositionUpdater(this, camera);
        tween_js_ticker_1.TWEENTicker.start();
    }
    /**
     * カメラ位置の初期設定を行う
     * @param pos
     * @param targetPos
     */
    initCameraPosition(pos, targetPos) {
        this.pos = pos;
        const lmt = this.limiter;
        this.pos.phi = lmt.clampPosition(TargetParam_1.SphericalParamType.PHI, this.pos);
        this.pos.theta = lmt.clampPosition(TargetParam_1.SphericalParamType.THETA, this.pos);
        this.pos.radius = lmt.clampPosition(TargetParam_1.SphericalParamType.R, this.pos);
        if (targetPos) {
            this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
        }
        this.dispatchUpdateEvent();
    }
    /**
     * カメラの位置ずれ設定を行う。
     * @param {Vector3} shift
     */
    initCameraShift(shift) {
        this.cameraShift = shift.clone();
        this.dispatchUpdateEvent();
    }
    /**
     * カメラを任意の位置に移動する
     * @param pos
     * @param option
     */
    move(pos, option) {
        option = EasingOption_1.EasingOption.init(option, this);
        this.tweens.stop();
        this.movePosition(TargetParam_1.SphericalParamType.R, pos.radius, option);
        this.movePosition(TargetParam_1.SphericalParamType.PHI, pos.phi, option);
        this.movePosition(TargetParam_1.SphericalParamType.THETA, pos.theta, option);
    }
    /**
     * カメラターゲットの変更
     * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。
     * @param _target
     */
    changeTarget(_target) {
        this._cameraTarget = _target;
        // ここでダミーのカメラターゲットをシーン直下に生成
        // 両ターゲット間をtweenさせる。
        // 座標はworld座標に変換して統一。
        // tweenが終了したらthis._cameraTargetを差し替え。
    }
    /**
     * カメラ座標のうち、typeで指定された１つのパラメーターを移動する
     * @param type
     * @param value
     * @param option
     */
    movePosition(type, value, option) {
        option = EasingOption_1.EasingOption.init(option, this);
        if (type === TargetParam_1.SphericalParamType.THETA && option.normalize) {
            value = SphericalControllerUtil_1.SphericalControllerUtil.getTweenTheta(this.pos.theta, value);
        }
        const to = this.limiter.clampWithType(type, value);
        this.tweens.overrideTween(type, this.getTweenPosition(type, to, option));
    }
    /**
     * movePosition関数用のtweenオブジェクトを生成する。
     * @param targetParam
     * @param to
     * @param option
     */
    getTweenPosition(targetParam, to, option) {
        const toObj = {};
        toObj[targetParam] = to;
        return new tween_js_1.Tween(this.pos)
            .to(toObj, option.duration)
            .easing(option.easing)
            .onUpdate(this.dispatchUpdateEvent)
            .onComplete(() => {
            this.onCompleteCameraTween(targetParam);
        })
            .start();
    }
    /**
     * Tweenのcompleteイベントで呼び出される関数。
     * MOVED_CAMERA_COMPLETEイベントを発行する。
     * @param paramType
     */
    onCompleteCameraTween(paramType) {
        this.dispatchEvent(new SphericalControllerEvent_1.SphericalControllerEvent(SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA_COMPLETE, paramType));
    }
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value, option) {
        option = EasingOption_1.EasingOption.init(option, this);
        const tween = new tween_js_1.Tween(this._cameraTarget.position)
            .to({ x: value.x, y: value.y, z: value.z }, option.duration)
            .easing(option.easing)
            .onUpdate(this.dispatchUpdateEvent)
            .start();
        this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_TARGET, tween);
    }
    stopLoop(type) {
        this.tweens.stopTween(type);
    }
    /**
     * カメラ位置をループで移動させる。
     * ゆらゆらと動かすための処理。
     * @param type どのプロパティを操作するか。
     * @param min
     * @param max
     * @param option このアニメーションに対する1回限りの設定を行う。
     */
    loop(type, min, max, option) {
        if (type === TargetParam_1.SphericalParamType.THETA) {
            this.pos.theta = SphericalControllerUtil_1.SphericalControllerUtil.PI2ToPI(this.pos.theta);
        }
        option = EasingOption_1.EasingOption.init(option, this, true);
        const toMin = this.limiter.clampWithType(type, min);
        const toMax = this.limiter.clampWithType(type, max);
        const toObjMax = {};
        toObjMax[type] = toMax;
        const toObjMin = {};
        toObjMin[type] = toMin;
        const loop = () => {
            const tween = new tween_js_1.Tween(this.pos)
                .to(toObjMax, option.duration)
                .yoyo(true)
                .easing(option.easing)
                .onUpdate(this.dispatchUpdateEvent)
                .repeat(Infinity)
                .start();
            this.tweens.overrideTween(type, tween);
        };
        const firstDuration = SphericalControllerUtil_1.SphericalControllerUtil.getFirstDuration(option.duration, this.pos[type], toMax, toMin);
        const tween = new tween_js_1.Tween(this.pos)
            .easing(option.easing)
            .to(toObjMin, firstDuration)
            .onUpdate(this.dispatchUpdateEvent)
            .onComplete(loop)
            .start();
        this.tweens.overrideTween(type, tween);
    }
    /**
     * カメラシフトを移動する
     * @param value 移動先
     * @param option
     */
    moveCameraShift(value, option) {
        option = EasingOption_1.EasingOption.init(option, this);
        const tween = new tween_js_1.Tween(this.cameraShift)
            .easing(option.easing)
            .to({ x: value.x, y: value.y, z: value.z }, option.duration)
            .onUpdate(this.dispatchUpdateEvent)
            .start();
        this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_SHIFT, tween);
    }
    /**
     * カメラターゲットの座標を加算する。
     * 水平、垂直移動などに使用
     * @param pos
     * @param overrideTween
     */
    addTargetPosition(pos, overrideTween = false) {
        if (!overrideTween && this.tweens.isPlaying())
            return;
        if (overrideTween && this.tweens.isPlaying()) {
            this.tweens.stop();
        }
        this._cameraTarget.position.add(pos);
        this.dispatchUpdateEvent();
    }
    /**
     * カメラのSpherical座標に加算する。
     * @param type
     * @param value
     * @param overrideTween
     */
    addPosition(type, value, overrideTween = false) {
        if (!overrideTween && this.tweens.isPlaying())
            return;
        if (overrideTween && this.tweens.isPlaying()) {
            this.tweens.stop();
        }
        this.pos[type] += value;
        this.pos[type] = this.limiter.clampPosition(type, this.pos);
        this.dispatchUpdateEvent();
    }
    /**
     * カメラ座標を他のSphericalオブジェクトに転写する。
     * @param spherical
     */
    copySphericalPosition(spherical) {
        return spherical.copy(this.pos);
    }
    /**
     * カメラ座標を複製する。
     */
    cloneSphericalPosition() {
        return this.pos.clone();
    }
}
exports.SphericalController = SphericalController;
