import type { SphericalController } from "./SphericalController.js";

export interface RequiredEasingOption {
  duration: number;
  easing: (k: number) => number;
  normalize: boolean;
  startTime?: number;
}
/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export class EasingOption {
  duration?: number;
  easing?: (k: number) => number;
  normalize?: boolean; //回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
  startTime?: number;

  static init(
    option: EasingOption | undefined,
    controller: SphericalController,
    isLoop = false,
  ): RequiredEasingOption {
    const result: EasingOption = { ...(option ?? {}) };

    result.duration ??= controller.tweens.duration;

    const defaultEase = isLoop
      ? controller.tweens.loopEasing
      : controller.tweens.easing;
    result.easing ??= defaultEase;
    result.normalize ??= true;

    return result as RequiredEasingOption;
  }
}
