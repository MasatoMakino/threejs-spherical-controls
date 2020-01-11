/// <reference types="tween.js" />
import TWEEN from "@tweenjs/tween.js";
import { SphericalParamType, TargetParam } from "./TargetParam";
export declare type TweenMapKey = SphericalParamType | TargetParam;
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export declare class SphericalControllerTween {
  private tweenMap;
  duration: number;
  easing: (k: number) => number;
  loopEasing: (k: number) => number;
  constructor();
  /**
   * 指定されたTweenを停止する。
   * @param type
   */
  stopTween(type: TargetParam | SphericalParamType): void;
  /**
   * 指定されたTweenを停止し、受け取ったTweenで上書きする。
   * @param type
   * @param tween
   */
  overrideTween(type: TweenMapKey, tween: TWEEN.Tween | null): void;
  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  isPlaying(): boolean;
  /**
   * 全てのtweenインスタンスを停止する。
   */
  stop(): void;
}
//# sourceMappingURL=SphericalControllerTween.d.ts.map
