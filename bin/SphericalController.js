var Tween = createjs.Tween;
import { EventDispatcher, MeshBasicMaterial, Spherical, Vector3 } from "three";
import { SphericalControllerEvent, SphericalControllerEventType, TargetParam } from "./SphericalControllerEvent";
import { EasingOption } from "./EasingOption";
import { SphericalControllerUtil } from "./SphericalControllerUtil";
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
export class SphericalController extends EventDispatcher {
    /**
     * コンストラクタ
     * @param camera
     * @param target
     */
    constructor(camera, target) {
        super();
        //画面のシフト
        // 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
        // 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
        this.cameraShift = new Vector3();
        this.tweens = new SphericalControllerTween();
        this.limiter = new CameraPositionLimiter();
        this.pos = new Spherical();
        this.isUpdate = false;
        /**
         * tweenによる更新フラグ処理
         * イベントハンドラーで処理できるように関数とする。
         * @param e
         */
        this.setNeedUpdate = (e) => {
            this.isUpdate = true;
        };
        /**
         * カメラ位置および注視点の更新処理
         */
        this.updatePosition = () => {
            if (!this.isUpdate)
                return;
            this.isUpdate = false;
            let cameraTargetPos = new Vector3();
            let cameraPos = this._camera.position;
            cameraPos.setFromSpherical(this.pos);
            cameraPos.add(this._cameraTarget.getWorldPosition(cameraTargetPos));
            this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
            this._camera.lookAt(this._cameraTarget.getWorldPosition(cameraTargetPos));
            if (this.cameraShift) {
                const pos = this._camera.position.clone();
                const move = new Vector3(this.cameraShift.x, this.cameraShift.y, this.cameraShift.z);
                move.applyEuler(this._camera.rotation.clone());
                pos.add(move);
                this._camera.position.set(pos.x, pos.y, pos.z);
            }
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA));
        };
        this._camera = camera;
        this._cameraTarget = target;
        this._cameraTarget.material = new MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.0,
            transparent: true
        });
        this._cameraTarget.onBeforeRender = () => {
            this.updatePosition();
        };
    }
    /**
     * カメラ位置の初期設定を行う
     * @param pos
     * @param targetPos
     */
    initCameraPosition(pos, targetPos) {
        this.pos = pos;
        const lmt = this.limiter;
        this.pos.phi = lmt.clampPosition(TargetParam.PHI, this.pos);
        this.pos.theta = lmt.clampPosition(TargetParam.THETA, this.pos);
        if (targetPos) {
            this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
        }
        this.setNeedUpdate();
    }
    /**
     * カメラの位置ずれ設定を行う。
     * @param {Vector3} shift
     */
    initCameraShift(shift) {
        this.cameraShift = shift.clone();
        this.setNeedUpdate();
    }
    /**
     * カメラを任意の位置に移動する
     * @param pos
     * @param option
     */
    move(pos, option) {
        option = EasingOption.init(option, this);
        this.stop();
        this.moveR(pos.radius, option);
        this.movePhi(pos.phi, option);
        this.moveTheta(pos.theta, option);
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
     * 半径のみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveR(value, option) {
        option = EasingOption.init(option, this);
        this.tweens.overrideTween(TargetParam.R, this.getTweenPosition(TargetParam.R, value, option));
    }
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value, option) {
        option = EasingOption.init(option, this);
        const tween = Tween.get(this._cameraTarget.position).to({ x: value.x, y: value.y, z: value.z }, option.duration, option.easing);
        tween.addEventListener("change", this.setNeedUpdate);
        this.tweens.overrideTween(TargetParam.CAMERA_TARGET, tween);
    }
    /**
     * 経度のみを移動する
     * 横向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    moveTheta(value, option) {
        option = EasingOption.init(option, this);
        let to = value;
        if (option.normalize) {
            to = SphericalControllerUtil.getTweenTheta(this.pos.theta, value);
        }
        to = this.limiter.clampWithType(TargetParam.THETA, to);
        const tween = this.getTweenPosition(TargetParam.THETA, to, option);
        this.tweens.overrideTween(TargetParam.THETA, tween);
    }
    getTweenPosition(targetParam, to, option) {
        const toObj = {};
        toObj[targetParam] = to;
        const tween = Tween.get(this.pos).to(toObj, option.duration, option.easing);
        tween.addEventListener("change", this.setNeedUpdate);
        tween.addEventListener("complete", e => {
            this.onCompleteCameraTween(targetParam);
        });
        return tween;
    }
    onCompleteCameraTween(paramType) {
        this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE, paramType));
    }
    /**
     * 緯度のみを移動する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    movePhi(value, option) {
        option = EasingOption.init(option, this);
        const to = this.limiter.clampWithType(TargetParam.PHI, value);
        const tween = this.getTweenPosition(TargetParam.PHI, to, option);
        this.tweens.overrideTween(TargetParam.PHI, tween);
    }
    /**
     * 緯度のみをループで移動させる。
     * 縦方向にゆらゆらと回転させるための処理
     * @param {number} min　単位はラジアン角
     * @param {number} max　単位はラジアン角
     * @param option
     */
    loopMovePhi(min, max, option) {
        this.loop(TargetParam.PHI, min, max, option);
    }
    loopMoveTheta(min, max, option) {
        this.pos.theta = SphericalControllerUtil.PI2ToPI(this.pos.theta);
        this.loop(TargetParam.THETA, min, max, option);
    }
    /**
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param option
     */
    loopMoveR(min, max, option) {
        this.loop(TargetParam.R, min, max, option);
    }
    stopLoopMoveR() {
        this.tweens.stopTween(TargetParam.R);
    }
    stopLoopMovePhi() {
        this.tweens.stopTween(TargetParam.PHI);
    }
    stopLoopMoveTheta() {
        this.tweens.stopTween(TargetParam.THETA);
    }
    loop(type, min, max, option) {
        option = EasingOption.init(option, this, true);
        const toMin = this.limiter.clampWithType(type, min);
        const toMax = this.limiter.clampWithType(type, max);
        const toObjMax = {};
        toObjMax[type] = toMax;
        const toObjMin = {};
        toObjMin[type] = toMin;
        const loop = () => {
            const tween = Tween.get(this.pos, { loop: -1 })
                .to(toObjMax, option.duration, option.easing)
                .to(toObjMin, option.duration, option.easing);
            tween.addEventListener("change", this.setNeedUpdate);
            this.tweens.overrideTween(type, tween);
        };
        const firstDuration = SphericalController.getFirstDuration(option.duration, this.pos[type], toMax, toMin);
        const tween = Tween.get(this.pos)
            .to(toObjMin, firstDuration, option.easing)
            .call(loop);
        tween.addEventListener("change", this.setNeedUpdate);
        this.tweens.overrideTween(type, tween);
    }
    static getFirstDuration(duration, current, max, min) {
        return Math.abs(duration * ((current - min) / (max - min)));
    }
    /**
     * カメラシフトを移動する
     * @param value 移動先
     * @param option
     */
    moveCameraShift(value, option) {
        option = EasingOption.init(option, this);
        if (!this.cameraShift) {
            this.cameraShift = new Vector3();
        }
        const tween = Tween.get(this.cameraShift).to({ x: value.x, y: value.y, z: value.z }, option.duration, option.easing);
        tween.addEventListener("change", this.setNeedUpdate);
        this.tweens.overrideTween(TargetParam.CAMERA_SHIFT, tween);
    }
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value, overrideTween = false) {
        this.addPosition(TargetParam.R, value, overrideTween);
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
            this.stop();
        }
        this._cameraTarget.position.add(pos);
        this.setNeedUpdate(null);
    }
    /**
     * 経度を加算する。
     * 横方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addTheta(value, overrideTween = false) {
        this.addPosition(TargetParam.THETA, value, overrideTween);
    }
    /**
     * 緯度を加算する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addPhi(value, overrideTween = false) {
        this.addPosition(TargetParam.PHI, value, overrideTween);
    }
    /**
     * カメラのSpherical座標に加算する。
     * @param targetParam
     * @param value
     * @param overrideTween
     */
    addPosition(targetParam, value, overrideTween = false) {
        if (!overrideTween && this.tweens.isPlaying())
            return;
        if (overrideTween && this.tweens.isPlaying()) {
            this.stop();
        }
        this.pos[targetParam] += value;
        this.pos[targetParam] = this.limiter.clampPosition(targetParam, this.pos);
        this.setNeedUpdate(null);
    }
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    stop() {
        Tween.removeTweens(this._cameraTarget);
        Tween.removeTweens(this.cameraShift);
        Tween.removeTweens(this.pos);
        const tweenArray = this.tweens.getTweenArray();
        for (let tween of tweenArray) {
            if (tween)
                tween.removeAllEventListeners();
        }
    }
}
