import Tween = createjs.Tween;
import Ease = createjs.Ease;
import { SphericalParamType, TargetParam } from "./TargetParam";

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

  stopTween(type: TargetParam | SphericalParamType): void {
    const tween = this.getTween(type);
    if (!tween) return;
    tween.paused = true;
    tween.removeAllEventListeners();
    this.setTween(type, null);
  }

  getTween(type: TargetParam | SphericalParamType): Tween {
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

  setTween(type: TargetParam | SphericalParamType, tween: Tween | null): void {
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

  overrideTween(
    type: TargetParam | SphericalParamType,
    tween: Tween | null
  ): void {
    this.stopTween(type);
    this.setTween(type, tween);
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

  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  public isPlaying(): boolean {
    const tweenArray = this.getTweenArray();
    for (let tween of tweenArray) {
      if (tween && !tween.paused) return true;
    }
    return false;
  }

  /**
   * 全てのtweenインスタンスを停止する。
   */
  public stop(): void {
    const tweenArray = this.getTweenArray();
    for (let tween of tweenArray) {
      if (tween) tween.removeAllEventListeners();
    }
  }
}
