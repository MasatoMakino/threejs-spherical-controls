import { Easing, Tween } from "@tweenjs/tween.js";
import { SphericalParamType, TargetParam } from "./TargetParam";
import { Spherical } from "three";
import { Vector3 } from "three";

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
    this.tweenMap.forEach((value: Tween<TweenType>, key: TweenMapKey) => {
      if (value && value.isPlaying()) isPlaying = true;
    });

    return isPlaying;
  }

  /**
   * 全てのtweenインスタンスを停止する。
   */
  public stop(): void {
    this.tweenMap.forEach((value: Tween<TweenType>, key: TweenMapKey) => {
      if (key) this.stopTween(key);
    });
  }
}
