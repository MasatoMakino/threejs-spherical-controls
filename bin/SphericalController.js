var Tween = createjs.Tween;
var Ease = createjs.Ease;
import { EventDispatcher, MeshBasicMaterial, Spherical, Vector3 } from "three";
import { SphericalControllerEvent, SphericalControllerEventType } from "./SphericalControllerEvent";
import { TargetParam } from "./SphericalControllerEvent";
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
        this.duration = 1333;
        this.easing = Ease.cubicOut;
        this.loopEasing = Ease.sineInOut;
        this.pos = new Spherical();
        this.phiMin = SphericalController.EPS;
        this.phiMax = Math.PI - SphericalController.EPS;
        this.thetaMin = null;
        this.thetaMax = null;
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
        this.pos.phi = this.limitPhi(this.pos.phi);
        this.pos.theta = this.limitTheta(this.pos.theta);
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
        this.tweenR = SphericalController.removeTween(this.tweenR);
        this.tweenR = Tween.get(this.pos).to({ radius: value }, option.duration, option.easing);
        this.tweenR.addEventListener("change", this.setNeedUpdate);
        this.tweenR.addEventListener("complete", e => {
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE, TargetParam.R));
        });
    }
    /**
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param option
     */
    loopMoveR(min, max, option) {
        option = EasingOption.init(option, this, true);
        const stopTween = () => {
            this.tweenR = SphericalController.removeTween(this.tweenR);
        };
        const loop = () => {
            stopTween();
            this.tweenR = Tween.get(this.pos, { loop: -1 })
                .to({ radius: max }, option.duration, option.easing)
                .to({ radius: min }, option.duration, option.easing);
            this.tweenR.addEventListener("change", this.setNeedUpdate);
        };
        stopTween();
        const firstDuration = Math.abs(option.duration * ((this.pos.radius - min) / (max - min)));
        this.tweenR = Tween.get(this.pos)
            .to({ radius: min }, firstDuration, option.easing)
            .call(loop);
        this.tweenR.addEventListener("change", this.setNeedUpdate);
    }
    stopLoopMoveR() {
        this.tweenR = SphericalController.removeTween(this.tweenR);
    }
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     * @param option
     */
    moveTarget(value, option) {
        option = EasingOption.init(option, this);
        this.tweenTarget = SphericalController.removeTween(this.tweenTarget);
        this.tweenTarget = Tween.get(this._cameraTarget.position).to({ x: value.x, y: value.y, z: value.z }, option.duration, option.easing);
        this.tweenTarget.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 経度のみを移動する
     * 横向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    moveTheta(value, option) {
        option = EasingOption.init(option, this);
        this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
        let to = value;
        if (option.normalize) {
            to = SphericalController.getTweenTheta(this.pos.theta, value);
        }
        to = this.limitTheta(to);
        this.tweenTheta = Tween.get(this.pos).to({ theta: to }, option.duration, option.easing);
        this.tweenTheta.addEventListener("change", this.setNeedUpdate);
        this.tweenTheta.addEventListener("complete", e => {
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE, TargetParam.THETA));
        });
    }
    /**
     * 緯度のみを移動する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param option
     */
    movePhi(value, option) {
        option = EasingOption.init(option, this);
        this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
        const to = this.limitPhi(value);
        this.tweenPhi = Tween.get(this.pos).to({ phi: to }, option.duration, option.easing);
        this.tweenPhi.addEventListener("change", this.setNeedUpdate);
        this.tweenPhi.addEventListener("complete", e => {
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE, TargetParam.PHI));
        });
    }
    /**
     * 緯度のみをループで移動させる。
     * 縦方向にゆらゆらと回転させるための処理
     * @param {number} min　単位はラジアン角
     * @param {number} max　単位はラジアン角
     * @param option
     */
    loopMovePhi(min, max, option) {
        option = EasingOption.init(option, this, true);
        const toMin = this.limitPhi(min);
        const toMax = this.limitPhi(max);
        const loop = () => {
            this.stopLoopMovePhi();
            this.tweenPhi = Tween.get(this.pos, { loop: -1 })
                .to({ phi: toMax }, option.duration, option.easing)
                .to({ phi: toMin }, option.duration, option.easing);
            this.tweenPhi.addEventListener("change", this.setNeedUpdate);
        };
        this.stopLoopMovePhi();
        const firstDuration = this.getFirstDuration(option.duration, this.pos.phi, toMax, toMin);
        this.tweenPhi = Tween.get(this.pos)
            .to({ phi: toMin }, firstDuration, option.easing)
            .call(loop);
        this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    }
    getFirstDuration(duration, current, max, min) {
        return Math.abs(duration * ((current - min) / (max - min)));
    }
    stopLoopMovePhi() {
        this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    }
    loopMoveTheta(min, max, option) {
        option = EasingOption.init(option, this, true);
        const toMin = this.limitTheta(min);
        const toMax = this.limitTheta(max);
        const loop = () => {
            this.stopLoopMoveTheta();
            this.tweenTheta = Tween.get(this.pos, { loop: -1 })
                .to({ theta: toMax }, option.duration, option.easing)
                .to({ theta: toMin }, option.duration, option.easing);
            this.tweenTheta.addEventListener("change", this.setNeedUpdate);
        };
        this.stopLoopMoveTheta();
        const firstDuration = this.getFirstDuration(option.duration, this.pos.theta, toMax, toMin);
        this.tweenTheta = Tween.get(this.pos)
            .to({ theta: toMin }, firstDuration, option.easing)
            .call(loop);
        this.tweenTheta.addEventListener("change", this.setNeedUpdate);
    }
    stopLoopMoveTheta() {
        this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
    }
    /**
     * カメラシフトを移動する
     * @param value 移動先
     * @param option
     */
    moveCameraShift(value, option) {
        option = EasingOption.init(option, this);
        this.tweenCameraShift = SphericalController.removeTween(this.tweenCameraShift);
        if (!this.cameraShift) {
            this.cameraShift = new Vector3();
        }
        this.tweenCameraShift = Tween.get(this.cameraShift).to({ x: value.x, y: value.y, z: value.z }, option.duration, option.easing);
        this.tweenCameraShift.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value, overrideTween = false) {
        if (!overrideTween && this.isPlaying())
            return;
        if (overrideTween && this.isPlaying()) {
            this.stop();
        }
        this.pos.radius += value;
        this.setNeedUpdate(null);
    }
    /**
     * カメラターゲットの座標を加算する。
     * 水平、垂直移動などに使用
     * @param pos
     * @param overrideTween
     */
    addTargetPosition(pos, overrideTween = false) {
        if (!overrideTween && this.isPlaying())
            return;
        if (overrideTween && this.isPlaying()) {
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
        if (!overrideTween && this.isPlaying())
            return;
        if (overrideTween && this.isPlaying()) {
            this.stop();
        }
        this.pos.theta += value;
        this.pos.theta = this.limitTheta(this.pos.theta);
        this.setNeedUpdate(null);
    }
    /**
     * 緯度を加算する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addPhi(value, overrideTween = false) {
        if (!overrideTween && this.isPlaying())
            return;
        if (overrideTween && this.isPlaying()) {
            this.stop();
        }
        this.pos.phi += value;
        this.pos.phi = this.limitPhi(this.pos.phi);
        this.setNeedUpdate(null);
    }
    limitPhi(phi) {
        if (this.phiMax == null || this.phiMin == null)
            return phi;
        phi = Math.min(phi, this.phiMax);
        phi = Math.max(phi, this.phiMin);
        return phi;
    }
    limitTheta(theta) {
        if (this.thetaMin == null || this.thetaMax == null)
            return theta;
        theta = Math.min(theta, this.thetaMax);
        theta = Math.max(theta, this.thetaMin);
        return theta;
    }
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    stop() {
        Tween.removeTweens(this._cameraTarget);
        Tween.removeTweens(this.cameraShift);
        Tween.removeTweens(this.pos);
        if (this.tweenTarget)
            this.tweenTarget.removeAllEventListeners();
        if (this.tweenR)
            this.tweenR.removeAllEventListeners();
        if (this.tweenTheta)
            this.tweenTheta.removeAllEventListeners();
        if (this.tweenPhi)
            this.tweenPhi.removeAllEventListeners();
        if (this.tweenCameraShift)
            this.tweenCameraShift.removeAllEventListeners();
    }
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying() {
        if (this.tweenR && !this.tweenR.paused)
            return true;
        if (this.tweenTheta && !this.tweenTheta.paused)
            return true;
        if (this.tweenPhi && !this.tweenPhi.paused)
            return true;
        if (this.tweenCameraShift && !this.tweenCameraShift.paused)
            return true;
        if (this.tweenTarget && !this.tweenTarget.paused)
            return true;
        return false;
    }
    /**
     * 指定されたtweenを停止する。
     * @param {createjs.Tween | null} tween
     * @return {null}
     */
    static removeTween(tween) {
        if (!tween)
            return null;
        tween.paused = true;
        tween.removeAllEventListeners();
        return null;
    }
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param from
     * @param to
     * @returns {number}    最短距離での目標となる回転角
     */
    static getTweenTheta(from, to) {
        to = this.PI2ToPI(to);
        let fromDif = this.PI2ToPI(from);
        fromDif = this.PI2ToPI(to - fromDif);
        return from + fromDif;
    }
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * Math.PIもしくは-Math.PIを入力すると正負が反転する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    static PI2ToPI(value) {
        return Math.atan2(Math.sin(value), Math.cos(value));
    }
}
SphericalController.EPS = 0.000001;
/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export class EasingOption {
    static init(option, controller, isLoop = false) {
        if (option == null) {
            option = new EasingOption();
        }
        if (option.duration == null) {
            option.duration = controller.duration;
        }
        if (option.easing == null) {
            option.easing = controller.easing;
            if (isLoop) {
                option.easing = controller.loopEasing;
            }
        }
        if (option.normalize === null || option.normalize === undefined) {
            option.normalize = true;
        }
        return option;
    }
}
