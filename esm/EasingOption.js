/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export class EasingOption {
  static init(option, controller, isLoop = false) {
    if (option == null) {
      option = new EasingOption();
    }
    option.duration = this.supplement(
      option.duration,
      controller.tweens.duration
    );
    const defaultEase = isLoop
      ? controller.tweens.loopEasing
      : controller.tweens.easing;
    option.easing = this.supplement(option.easing, defaultEase);
    option.normalize = this.supplement(option.normalize, true);
    return option;
  }
  static supplement(target, defaultValue) {
    if (target == null) return defaultValue;
    return target;
  }
}
