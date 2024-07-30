import { Easing, Tween } from "@tweenjs/tween.js";
import { SphericalParamType, TargetParam } from "./index.js";
import { Spherical, Vector3 } from "three";
import { RAFTickerEventContext } from "@masatomakino/raf-ticker";

export type TweenMapKey = SphericalParamType | TargetParam;
export type TweenType = Spherical | Vector3;
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export class SphericalControllerTween {
  private tweenMap: Map<TweenMapKey, Tween<TweenType>> = new Map();

  public duration: number = 1333;
  public easing = Easing.Cubic.Out;
  public loopEasing = Easing.Sinusoidal.InOut;

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
  overrideTween(type: TweenMapKey, tween?: Tween<TweenType>): void {
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
    this.tweenMap.forEach((value) => {
      if (value?.isPlaying()) isPlaying = true;
    });

    return isPlaying;
  }

  /**
   * 現在、指定されたkeyに対応するtweenが再生中か否かを判定する。
   * @param key
   */
  public isPlayingWithKey(key: TweenMapKey): boolean {
    const tween = this.tweenMap.get(key);
    if (!tween) return false;
    return tween.isPlaying();
  }

  /**
   * 全てのtweenインスタンスを停止する。
   */
  public stop(): void {
    this.tweenMap.forEach((_, key) => {
      if (key) this.stopTween(key);
    });
  }

  /**
   * 全てのtweenインスタンスを更新する。
   * @param e RAFTickerEventContext
   */
  update(e: RAFTickerEventContext): void {
    this.tweenMap.forEach((value) => {
      value.update(e.timestamp);
    });
  }
}
