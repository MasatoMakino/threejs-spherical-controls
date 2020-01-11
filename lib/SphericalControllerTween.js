"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var tween_js_1 = __importDefault(require("@tweenjs/tween.js"));
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
var SphericalControllerTween = /** @class */ (function() {
  function SphericalControllerTween() {
    this.tweenMap = new Map();
    this.duration = 1333;
    this.easing = tween_js_1.default.Easing.Cubic.Out;
    this.loopEasing = tween_js_1.default.Easing.Sinusoidal.InOut;
  }
  /**
   * 指定されたTweenを停止する。
   * @param type
   */
  SphericalControllerTween.prototype.stopTween = function(type) {
    var tween = this.tweenMap.get(type);
    if (!tween) return;
    tween.stop();
    this.tweenMap.delete(type);
  };
  /**
   * 指定されたTweenを停止し、受け取ったTweenで上書きする。
   * @param type
   * @param tween
   */
  SphericalControllerTween.prototype.overrideTween = function(type, tween) {
    this.stopTween(type);
    if (tween) {
      this.tweenMap.set(type, tween);
    }
  };
  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  SphericalControllerTween.prototype.isPlaying = function() {
    var isPlaying = false;
    this.tweenMap.forEach(function(value, key) {
      if (value && value.isPlaying()) isPlaying = true;
    });
    return isPlaying;
  };
  /**
   * 全てのtweenインスタンスを停止する。
   */
  SphericalControllerTween.prototype.stop = function() {
    var _this = this;
    this.tweenMap.forEach(function(value, key) {
      if (key) _this.stopTween(key);
    });
  };
  return SphericalControllerTween;
})();
exports.SphericalControllerTween = SphericalControllerTween;
