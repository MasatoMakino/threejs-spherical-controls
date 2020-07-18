"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphericalControllerUtil = void 0;
var SphericalControllerUtil = /** @class */ (function () {
    function SphericalControllerUtil() {
    }
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param from
     * @param to
     * @returns {number}    最短距離での目標となる回転角
     */
    SphericalControllerUtil.getTweenTheta = function (from, to) {
        to = this.PI2ToPI(to);
        var fromDif = this.PI2ToPI(from);
        fromDif = this.PI2ToPI(to - fromDif);
        return from + fromDif;
    };
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * Math.PIもしくは-Math.PIを入力すると正負が反転する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    SphericalControllerUtil.PI2ToPI = function (value) {
        return Math.atan2(Math.sin(value), Math.cos(value));
    };
    /**
     * loopアニメーションの初回振幅のdurationを算出する
     * @param duration
     * @param current
     * @param max
     * @param min
     */
    SphericalControllerUtil.getFirstDuration = function (duration, current, max, min) {
        return Math.abs(duration * ((current - min) / (max - min)));
    };
    return SphericalControllerUtil;
}());
exports.SphericalControllerUtil = SphericalControllerUtil;
