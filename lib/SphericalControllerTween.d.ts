/// <reference types="tweenjs" />
import Tween = createjs.Tween;
import { SphericalParamType, TargetParam } from "./TargetParam";
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export declare class SphericalControllerTween {
  private tweenMap;
  duration: number;
  easing: (amount: number) => number;
  loopEasing: (amount: number) => number;
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
  overrideTween(
    type: TargetParam | SphericalParamType,
    tween: Tween | null
  ): void;
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
