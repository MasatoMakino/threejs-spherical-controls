"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
var EasingOption = /** @class */ (function () {
    function EasingOption() {
    }
    EasingOption.init = function (option, controller, isLoop) {
        if (isLoop === void 0) { isLoop = false; }
        if (option == null) {
            option = new EasingOption();
        }
        option.duration = this.supplement(option.duration, controller.tweens.duration);
        var defaultEase = isLoop
            ? controller.tweens.loopEasing
            : controller.tweens.easing;
        option.easing = this.supplement(option.easing, defaultEase);
        option.normalize = this.supplement(option.normalize, true);
        return option;
    };
    EasingOption.supplement = function (target, defaultValue) {
        if (target == null)
            return defaultValue;
        return target;
    };
    return EasingOption;
}());
exports.EasingOption = EasingOption;
