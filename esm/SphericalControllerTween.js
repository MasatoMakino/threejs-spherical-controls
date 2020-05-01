import TWEEN from "@tweenjs/tween.js";

/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export class SphericalControllerTween {
    constructor() {
        this.tweenMap = new Map();
        this.duration = 1333;
        this.easing = TWEEN.Easing.Cubic.Out;
        this.loopEasing = TWEEN.Easing.Sinusoidal.InOut;
    }
    /**
     * 指定されたTweenを停止する。
     * @param type
     */
    stopTween(type) {
        const tween = this.tweenMap.get(type);
        if (!tween)
            return;
        tween.stop();
        this.tweenMap.delete(type);
    }
    /**
     * 指定されたTweenを停止し、受け取ったTweenで上書きする。
     * @param type
     * @param tween
     */
    overrideTween(type, tween) {
        this.stopTween(type);
        if (tween) {
            this.tweenMap.set(type, tween);
        }
    }
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying() {
        let isPlaying = false;
        this.tweenMap.forEach((value, key) => {
            if (value && value.isPlaying())
                isPlaying = true;
        });
        return isPlaying;
    }
    /**
     * 全てのtweenインスタンスを停止する。
     */
    stop() {
        this.tweenMap.forEach((value, key) => {
            if (key)
                this.stopTween(key);
        });
    }
}
