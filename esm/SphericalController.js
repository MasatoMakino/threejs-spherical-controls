import { Tween } from "@tweenjs/tween.js";
import { TWEENTicker } from "tween.js-ticker";
import { EventDispatcher, Spherical, Vector3 } from "three";
import { MeshBasicMaterial } from "three";
import { SphericalControllerEvent, SphericalControllerEventType, } from "./SphericalControllerEvent";
import { SphericalParamType, TargetParam } from "./TargetParam";
import { EasingOption } from "./EasingOption";
import { SphericalControllerUtil } from "./SphericalControllerUtil";
import { CameraPositionLimiter } from "./CameraPositionLimiter";
import { SphericalControllerTween } from "./SphericalControllerTween";
import { CameraPositionUpdater } from "./CameraPositionUpdater";
import { CameraUpdateEvent, CameraUpdateEventType } from "./CameraUpdateEvent";
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
export class SphericalController extends EventDispatcher {
    /**
     * コンストラクタ
     * @param camera
     * @param target
     */
    constructor(camera, target) {
        var _a;
        var _b;
        super();
        this.pos = new Spherical();
        /**
         * 画面のシフト
         * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
         * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
         */
        this.cameraShift = new Vector3();
        this.tweens = new SphericalControllerTween();
        this.limiter = new CameraPositionLimiter();
        this.dispatchUpdateEvent = () => {
            const e = new CameraUpdateEvent(CameraUpdateEventType.UPDATE, this._cameraTarget, this.pos, this.cameraShift);
            this.dispatchEvent(e);
        };
        this._cameraTarget = target;
        (_a = (_b = this._cameraTarget).material) !== null && _a !== void 0 ? _a : (_b.material = new MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.0,
            transparent: true,
        }));
        this.cameraUpdater = new CameraPositionUpdater(this, camera, this._cameraTarget);
        TWEENTicker.start();
    }
    /**
     * カメラ位置の初期設定を行う
     * @param pos
     * @param targetPos
     */
    initCameraPosition(pos, targetPos) {
        this.pos = pos;
        const lmt = this.limiter;
        this.pos.phi = lmt.clampPosition(SphericalParamType.PHI, this.pos);
        this.pos.theta = lmt.clampPosition(SphericalParamType.THETA, this.pos);
        this.pos.radius = lmt.clampPosition(SphericalParamType.R, this.pos);
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
        option = EasingOption.init(option, this);
        this.tweens.stop();
        this.movePosition(SphericalParamType.R, pos.radius, option);
        this.movePosition(SphericalParamType.PHI, pos.phi, option);
        this.movePosition(SphericalParamType.THETA, pos.theta, option);
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
        option = EasingOption.init(option, this);
        if (type === SphericalParamType.THETA && option.normalize) {
            value = SphericalControllerUtil.getTweenTheta(this.pos.theta, value);
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
        return new Tween(this.pos)
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
        this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE, paramType));
    }
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value, option) {
        option = EasingOption.init(option, this);
        const tween = new Tween(this._cameraTarget.position)
            .to({ x: value.x, y: value.y, z: value.z }, option.duration)
            .easing(option.easing)
            .onUpdate(this.dispatchUpdateEvent)
            .start();
        this.tweens.overrideTween(TargetParam.CAMERA_TARGET, tween);
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
        if (type === SphericalParamType.THETA) {
            this.pos.theta = SphericalControllerUtil.PI2ToPI(this.pos.theta);
        }
        option = EasingOption.init(option, this, true);
        const toMin = this.limiter.clampWithType(type, min);
        const toMax = this.limiter.clampWithType(type, max);
        const toObjMax = {};
        toObjMax[type] = toMax;
        const toObjMin = {};
        toObjMin[type] = toMin;
        const loop = () => {
            const tween = new Tween(this.pos)
                .to(toObjMax, option.duration)
                .yoyo(true)
                .easing(option.easing)
                .onUpdate(this.dispatchUpdateEvent)
                .repeat(Infinity)
                .start();
            this.tweens.overrideTween(type, tween);
        };
        const firstDuration = SphericalControllerUtil.getFirstDuration(option.duration, this.pos[type], toMax, toMin);
        const tween = new Tween(this.pos)
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
        option = EasingOption.init(option, this);
        const tween = new Tween(this.cameraShift)
            .easing(option.easing)
            .to({ x: value.x, y: value.y, z: value.z }, option.duration)
            .onUpdate(this.dispatchUpdateEvent)
            .start();
        this.tweens.overrideTween(TargetParam.CAMERA_SHIFT, tween);
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
}
