import TWEEN from "@tweenjs/tween.js";
import { SphericalParamType, TargetParam } from "./TargetParam";

export type TweenMapKey = SphericalParamType | TargetParam;

/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export class SphericalControllerTween {
  private tweenMap: Map<TweenMapKey, TWEEN.Tween> = new Map();

  public duration: number = 1333;
  public easing = TWEEN.Easing.Cubic.Out;
  public loopEasing = TWEEN.Easing.Sinusoidal.InOut;

  constructor() {}

  /**
   * 指定されたTweenを停止する。
   * @param type
   */
  stopTween(type: TargetParam | SphericalParamType): void {
    const tween = this.tweenMap.get(type);
    if (!tween) return;
    tween.stop();
    this.tweenMap.delete(type);
  }

  /**
   * 指定されたTweenを停止し、受け取ったTweenで上書きする。
   * @param type
   * @param tween
   */
  overrideTween(type: TweenMapKey, tween: TWEEN.Tween | null): void {
    this.stopTween(type);
    if (tween) {
      this.tweenMap.set(type, tween);
    }
  }

  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  public isPlaying(): boolean {
    let isPlaying = false;
    this.tweenMap.forEach((value: TWEEN.Tween, key: TweenMapKey) => {
      if (value && value.isPlaying()) isPlaying = true;
    });

    return isPlaying;
  }

  /**
   * 全てのtweenインスタンスを停止する。
   */
  public stop(): void {
    this.tweenMap.forEach((value: TWEEN.Tween, key: TweenMapKey) => {
      if (key) this.stopTween(key);
    });
  }
}
