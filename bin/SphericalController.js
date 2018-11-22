var Tween = createjs.Tween;
var Ease = createjs.Ease;
import { Vector3, EventDispatcher, MeshBasicMaterial, Spherical } from "three";
import { SphericalControllerEvent, SphericalControllerEventType } from "./SphericalControllerEvent";
/**
 * 球面座標系でカメラ位置をコントロールするクラス。
 *
 * カメラ位置はThetaおよびPhiで決定される。
 * 0, 0の場合北極上にカメラが位置する。
 * Phi : 0 ~ Math.PI (縦回転)
 * Theta : -Math.PI ~ Math.PI (横回転)
 * の範囲で可動する。
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
        this.isMoving = false;
        this.pos = new Spherical();
        this.phiLimitMin = 0.001;
        this.phiLimitMax = Math.PI - 0.001;
        this.isUpdate = false;
        /**
         * tweenによる更新フラグ処理
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
        /**
         * tweenのコンプリートイベントハンドラ
         * カメラ移動が終了したことを示すイベントを発行する。
         */
        this.onCompleteMove = () => {
            this.isMoving = false;
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA));
            this.dispatchEvent(new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA_COMPLETE));
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
     * @param normalize 回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
     */
    move(pos, normalize = true) {
        this.pauseTween();
        this.isMoving = true;
        this.moveR(pos.radius);
        this.movePhi(pos.phi);
        this.moveTheta(pos.theta, normalize);
        if (this.tweenPhi) {
            this.tweenPhi.addEventListener("complete", this.onCompleteMove);
        }
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
    /**************
     * 特定パラメーターのみ移動
     **************/
    /**
     * 半径のみを移動する
     * @param value 単位はラジアン角
     */
    moveR(value) {
        this.tweenR = SphericalController.removeTween(this.tweenR);
        this.tweenR = Tween.get(this.pos).to({ radius: value }, SphericalController.tweenDuration, SphericalController.tweenFunc);
        this.tweenR.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * カメラ半径のみをループで移動させる。
     * ゆらゆらとズームインアウトさせるための処理
     * @param {number} min
     * @param {number} max
     * @param {number} duration　往復の片道にかかる時間
     */
    loopMoveR(min, max, duration) {
        const stopTween = () => {
            this.tweenR = SphericalController.removeTween(this.tweenR);
        };
        const loop = () => {
            stopTween();
            this.tweenR = Tween.get(this.pos, { loop: -1 })
                .to({ radius: max }, duration, SphericalController.loopTweenFunc)
                .to({ radius: min }, duration, SphericalController.loopTweenFunc);
            this.tweenR.addEventListener("change", this.setNeedUpdate);
        };
        stopTween();
        const firstDuration = Math.abs(duration * ((this.pos.radius - min) / (max - min)));
        this.tweenR = Tween.get(this.pos)
            .to({ radius: min }, firstDuration, SphericalController.loopTweenFunc)
            .call(loop);
        this.tweenR.addEventListener("change", this.setNeedUpdate);
    }
    stopLoopMoveR() {
        this.tweenR = SphericalController.removeTween(this.tweenR);
    }
    /**
     * カメラターゲットのみを移動する
     * @param value 単位はラジアン角
     */
    moveTarget(value) {
        this.tweenTarget = SphericalController.removeTween(this.tweenTarget);
        this.tweenTarget = Tween.get(this._cameraTarget.position).to({ x: value.x, y: value.y, z: value.z }, SphericalController.tweenDuration, SphericalController.tweenFunc);
        this.tweenTarget.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 経度のみを移動する
     * 横向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param normalize 回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
     */
    moveTheta(value, normalize = true) {
        this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
        let to = value;
        if (normalize) {
            to = SphericalController.getTweenTheta(this.pos.theta, value);
        }
        this.tweenTheta = Tween.get(this.pos).to({ theta: to }, SphericalController.tweenDuration, SphericalController.tweenFunc);
        this.tweenTheta.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 緯度のみを移動する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     */
    movePhi(value) {
        this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
        const to = this.limitPhi(value);
        this.tweenPhi = Tween.get(this.pos).to({ phi: to }, SphericalController.tweenDuration, SphericalController.tweenFunc);
        this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 緯度のみをループで移動させる。
     * 縦方向にゆらゆらと回転させるための処理
     * @param {number} min　単位はラジアン角
     * @param {number} max　単位はラジアン角
     * @param {number} duration　往復の片道にかかる時間
     */
    loopMovePhi(min, max, duration) {
        const stopTween = () => {
            this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
        };
        const toMin = this.limitPhi(min);
        const toMax = this.limitPhi(max);
        const loop = () => {
            stopTween();
            this.tweenPhi = Tween.get(this.pos, { loop: -1 })
                .to({ phi: toMax }, duration, SphericalController.loopTweenFunc)
                .to({ phi: toMin }, duration, SphericalController.loopTweenFunc);
            this.tweenPhi.addEventListener("change", this.setNeedUpdate);
        };
        stopTween();
        const firstDuration = Math.abs(duration * ((this.pos.phi - toMin) / (toMax - toMin)));
        this.tweenPhi = Tween.get(this.pos)
            .to({ phi: toMin }, firstDuration, SphericalController.loopTweenFunc)
            .call(loop);
        this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    }
    stopLoopMovePhi() {
        this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    }
    /**
     * カメラシフトを移動する
     * @param value 移動先
     */
    moveCameraShift(value) {
        this.tweenCameraShift = SphericalController.removeTween(this.tweenCameraShift);
        if (!this.cameraShift) {
            this.cameraShift = new Vector3();
        }
        this.tweenCameraShift = Tween.get(this.cameraShift).to({ x: value.x, y: value.y, z: value.z }, SphericalController.tweenDuration, SphericalController.tweenFunc);
        this.tweenCameraShift.addEventListener("change", this.setNeedUpdate);
    }
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value, overrideTween = false) {
        if (!overrideTween && this.isMoving)
            return;
        if (overrideTween && this.isMoving) {
            this.pauseTween();
        }
        this.pos.radius += value;
        this.setNeedUpdate(null);
    }
    /**
     * カメラターゲットの位置を移動する。
     * 水平、垂直移動などに使用
     * @param pos
     * @param overrideTween
     */
    addTargetPosition(pos, overrideTween = false) {
        if (!overrideTween && this.isMoving)
            return;
        if (overrideTween && this.isMoving) {
            this.pauseTween();
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
        if (!overrideTween && this.isMoving)
            return;
        if (overrideTween && this.isMoving) {
            this.pauseTween();
        }
        this.pos.theta += value;
        this.pos.makeSafe();
        this.setNeedUpdate(null);
    }
    /**
     * 緯度を加算する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addPhi(value, overrideTween = false) {
        if (!overrideTween && this.isMoving)
            return;
        if (overrideTween && this.isMoving) {
            this.pauseTween();
        }
        this.pos.phi += value;
        this.pos.phi = this.limitPhi(this.pos.phi);
        this.setNeedUpdate(null);
    }
    limitPhi(phi) {
        if (this.phiLimitMax == null)
            return phi;
        phi = Math.min(phi, this.phiLimitMax);
        phi = Math.max(phi, this.phiLimitMin);
        return phi;
    }
    /**
     * 全てのtweenインスタンスを停止、破棄する
     */
    pauseTween() {
        //全体同時移動用Tween
        this.tweenTarget = SphericalController.removeTween(this.tweenTarget);
        //特定プロパティ用Tween
        this.tweenR = SphericalController.removeTween(this.tweenR);
        this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
        this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
        this.tweenCameraShift = SphericalController.removeTween(this.tweenCameraShift);
        this.isMoving = false;
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
        // console.log(fromDif);
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
SphericalController.tweenDuration = 1333;
SphericalController.tweenFunc = Ease.cubicOut;
SphericalController.loopTweenFunc = Ease.sineInOut;
