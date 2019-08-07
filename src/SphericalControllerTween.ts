import Tween = createjs.Tween;
import Ease = createjs.Ease;
import { TargetParam } from "./SphericalControllerEvent";

export class SphericalControllerTween {
  //カメラターゲット移動用tween
  private _tweenTarget!: Tween | null;

  //特定パラメーター移動用tween
  private _tweenR!: Tween | null;
  private _tweenTheta!: Tween | null;
  private _tweenPhi!: Tween | null;
  private _tweenCameraShift!: Tween | null;

  public duration: number = 1333;
  public easing = Ease.cubicOut;
  public loopEasing = Ease.sineInOut;

  constructor() {}

  stopTween(type: TargetParam): void {
    const tween = this.getTween(type);
    if (!tween) return null;
    tween.paused = true;
    tween.removeAllEventListeners();
    this.setTween(type, null);
  }

  getTween(type: TargetParam): Tween {
    switch (type) {
      case TargetParam.R:
        return this._tweenR;
      case TargetParam.PHI:
        return this._tweenPhi;
      case TargetParam.THETA:
        return this._tweenTheta;
      case TargetParam.CAMERA_SHIFT:
        return this._tweenCameraShift;
      case TargetParam.CAMERA_TARGET:
        return this._tweenTarget;
    }
  }

  setTween(type: TargetParam, tween: any): void {
    switch (type) {
      case TargetParam.R:
        this._tweenR = tween;
        break;
      case TargetParam.PHI:
        this._tweenPhi = tween;
        break;
      case TargetParam.THETA:
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

  public getTweenArray(): Tween[] {
    return [
      this._tweenR,
      this._tweenTheta,
      this._tweenPhi,
      this._tweenCameraShift,
      this._tweenTarget
    ];
  }
}
