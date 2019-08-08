var Ease = createjs.Ease;
import { TargetParam } from "./SphericalControllerEvent";
import { SphericalParamType } from "./SphericalControllerEvent";
export class SphericalControllerTween {
    constructor() {
        this.duration = 1333;
        this.easing = Ease.cubicOut;
        this.loopEasing = Ease.sineInOut;
    }
    stopTween(type) {
        const tween = this.getTween(type);
        if (!tween)
            return;
        tween.paused = true;
        tween.removeAllEventListeners();
        this.setTween(type, null);
    }
    getTween(type) {
        switch (type) {
            case SphericalParamType.R:
                return this._tweenR;
            case SphericalParamType.PHI:
                return this._tweenPhi;
            case SphericalParamType.THETA:
                return this._tweenTheta;
            case TargetParam.CAMERA_SHIFT:
                return this._tweenCameraShift;
            case TargetParam.CAMERA_TARGET:
                return this._tweenTarget;
        }
    }
    setTween(type, tween) {
        switch (type) {
            case SphericalParamType.R:
                this._tweenR = tween;
                break;
            case SphericalParamType.PHI:
                this._tweenPhi = tween;
                break;
            case SphericalParamType.THETA:
                this._tweenTheta = tween;
                break;
            case TargetParam.CAMERA_SHIFT:
                this._tweenCameraShift = tween;
                break;
            case TargetParam.CAMERA_TARGET:
                this._tweenTarget = tween;
                break;
        }
    }
    overrideTween(type, tween) {
        this.stopTween(type);
        this.setTween(type, tween);
    }
    getTweenArray() {
        return [
            this._tweenR,
            this._tweenTheta,
            this._tweenPhi,
            this._tweenCameraShift,
            this._tweenTarget
        ];
    }
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying() {
        const tweenArray = this.getTweenArray();
        for (let tween of tweenArray) {
            if (tween && !tween.paused)
                return true;
        }
        return false;
    }
}
