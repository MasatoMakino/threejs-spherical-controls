import { SphericalController } from "./SphericalController.js";

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
    isLoop: boolean = false,
  ): RequiredEasingOption {
    if (option == null) {
      option = {};
    }

    option.duration ??= controller.tweens.duration;

    const defaultEase = isLoop
      ? controller.tweens.loopEasing
      : controller.tweens.easing;
    option.easing ??= defaultEase;
    option.normalize ??= true;

    return option as RequiredEasingOption;
  }
}
