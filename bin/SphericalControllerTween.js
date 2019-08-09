var Ease = createjs.Ease;
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export class SphericalControllerTween {
    constructor() {
        this.tweenMap = new Map();
        this.duration = 1333;
        this.easing = Ease.cubicOut;
        this.loopEasing = Ease.sineInOut;
    }
    /**
     * 指定されたTweenを停止する。
     * @param type
     */
    stopTween(type) {
        const tween = this.tweenMap.get(type);
        if (!tween)
            return;
        tween.paused = true;
        tween.removeAllEventListeners();
        this.tweenMap.set(type, null);
    }
    /**
     * 指定されたTweenを停止し、受け取ったTweenで上書きする。
     * @param type
     * @param tween
     */
    overrideTween(type, tween) {
        this.stopTween(type);
        this.tweenMap.set(type, tween);
    }
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying() {
        for (let tween of this.tweenMap.values()) {
            if (tween && !tween.paused)
                return true;
        }
        return false;
    }
    /**
     * 全てのtweenインスタンスを停止する。
     */
    stop() {
        for (let tween of this.tweenMap.values()) {
            if (tween)
                tween.removeAllEventListeners();
        }
    }
}
