import { SphericalController } from "./SphericalController";

/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */

export class EasingOption {
  duration?: number;
  easing?: Function;
  normalize?: boolean; //回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。

  static init(
    option: EasingOption,
    controller: SphericalController,
    isLoop: boolean = false
  ): EasingOption {
    if (option == null) {
      option = new EasingOption();
    }
    if (option.duration == null) {
      option.duration = controller.duration;
    }
    if (option.easing == null) {
      option.easing = controller.easing;
      if (isLoop) {
        option.easing = controller.loopEasing;
      }
    }
    if (option.normalize === null || option.normalize === undefined) {
      option.normalize = true;
    }
    return option;
  }
}
