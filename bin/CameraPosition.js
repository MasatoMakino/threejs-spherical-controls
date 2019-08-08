import { Spherical } from "three";
import { TargetParam } from "./SphericalControllerEvent";
export class CameraPosition {
    constructor() {
        this._position = new Spherical();
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
        this._position[targetParam] += value;
        this._position[targetParam] = this.limiter.clampPosition(targetParam, this._position);
        this.dispatchUpdateEvent();
    }
}
