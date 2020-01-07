"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ease = createjs.Ease;
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
var SphericalControllerTween = /** @class */ (function() {
  function SphericalControllerTween() {
    this.tweenMap = new Map();
    this.duration = 1333;
    this.easing = Ease.cubicOut;
    this.loopEasing = Ease.sineInOut;
  }
  /**
   * 指定されたTweenを停止する。
   * @param type
   */
  SphericalControllerTween.prototype.stopTween = function(type) {
    var tween = this.tweenMap.get(type);
    if (!tween) return;
    tween.paused = true;
    tween.removeAllEventListeners();
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
    for (var _i = 0, _a = this.tweenMap.values(); _i < _a.length; _i++) {
      var tween = _a[_i];
      if (tween && !tween.paused) return true;
    }
    return false;
  };
  /**
   * 全てのtweenインスタンスを停止する。
   */
  SphericalControllerTween.prototype.stop = function() {
    for (var _i = 0, _a = this.tweenMap.keys(); _i < _a.length; _i++) {
      var key = _a[_i];
      if (key) this.stopTween(key);
    }
  };
  return SphericalControllerTween;
})();
exports.SphericalControllerTween = SphericalControllerTween;
