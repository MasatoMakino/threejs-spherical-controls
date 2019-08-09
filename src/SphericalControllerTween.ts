import Tween = createjs.Tween;
import Ease = createjs.Ease;
import { SphericalParamType, TargetParam } from "./TargetParam";

/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export class SphericalControllerTween {
  private tweenMap: Map<SphericalParamType | TargetParam, Tween> = new Map();

  public duration: number = 1333;
  public easing = Ease.cubicOut;
  public loopEasing = Ease.sineInOut;

  constructor() {}

  /**
   * 指定されたTweenを停止する。
   * @param type
   */
  stopTween(type: TargetParam | SphericalParamType): void {
    const tween = this.tweenMap.get(type);
    if (!tween) return;
    tween.paused = true;
    tween.removeAllEventListeners();
    this.tweenMap.set(type, null);
  }

  /**
   * 指定されたTweenを停止し、受け取ったTweenで上書きする。
   * @param type
   * @param tween
   */
  overrideTween(
    type: TargetParam | SphericalParamType,
    tween: Tween | null
  ): void {
    this.stopTween(type);
    this.tweenMap.set(type, tween);
  }

  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  public isPlaying(): boolean {
    for (let tween of this.tweenMap.values()) {
      if (tween && !tween.paused) return true;
    }
    return false;
  }

  /**
   * 全てのtweenインスタンスを停止する。
   */
  public stop(): void {
    for (let tween of this.tweenMap.values()) {
      if (tween) tween.removeAllEventListeners();
    }
  }
}
