"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var tween_js_1 = __importDefault(require("@tweenjs/tween.js"));
var tween_js_ticker_1 = require("tween.js-ticker");
var three_1 = require("three");
var SphericalControllerEvent_1 = require("./SphericalControllerEvent");
var TargetParam_1 = require("./TargetParam");
var EasingOption_1 = require("./EasingOption");
var SphericalControllerUtil_1 = require("./SphericalControllerUtil");
var CameraPositionLimiter_1 = require("./CameraPositionLimiter");
var SphericalControllerTween_1 = require("./SphericalControllerTween");
var CameraPositionUpdater_1 = require("./CameraPositionUpdater");
var CameraUpdateEvent_1 = require("./CameraUpdateEvent");
/**
 * 球面座標系でカメラ位置をコントロールするクラス。
 *
 * カメラ位置はThetaおよびPhiで決定される。
 * 0, 0の場合北極上にカメラが位置する。
 * Phi : 0 ~ Math.PI (縦回転)
 * Theta : -Math.PI ~ Math.PI (横回転)
 * の範囲で可動する。
 *
 * 北極南極を通過すると緯度も反転するため、このクラスでは南北90度以上の移動には対応していない。また、極点上空では座標が一意の値にならないため、Phi 0もしくはPIには対応していない。
 */
var SphericalController = /** @class */ (function(_super) {
  __extends(SphericalController, _super);
  /**
   * コンストラクタ
   * @param camera
   * @param target
   */
  function SphericalController(camera, target) {
    var _this = _super.call(this) || this;
    _this.pos = new three_1.Spherical();
    /**
     * 画面のシフト
     * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
     * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
     */
    _this.cameraShift = new three_1.Vector3();
    _this.tweens = new SphericalControllerTween_1.SphericalControllerTween();
    _this.limiter = new CameraPositionLimiter_1.CameraPositionLimiter();
    _this.dispatchUpdateEvent = function() {
      var e = new CameraUpdateEvent_1.CameraUpdateEvent(
        CameraUpdateEvent_1.CameraUpdateEventType.UPDATE,
        _this._cameraTarget,
        _this.pos,
        _this.cameraShift
      );
      _this.dispatchEvent(e);
    };
    tween_js_ticker_1.TWEENTicker.start();
    _this._cameraTarget = target;
    _this._cameraTarget.material = new three_1.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.0,
      transparent: true
    });
    _this.cameraUpdater = new CameraPositionUpdater_1.CameraPositionUpdater(
      _this,
      camera,
      _this._cameraTarget
    );
    return _this;
  }
  /**
   * カメラ位置の初期設定を行う
   * @param pos
   * @param targetPos
   */
  SphericalController.prototype.initCameraPosition = function(pos, targetPos) {
    this.pos = pos;
    var lmt = this.limiter;
    this.pos.phi = lmt.clampPosition(
      TargetParam_1.SphericalParamType.PHI,
      this.pos
    );
    this.pos.theta = lmt.clampPosition(
      TargetParam_1.SphericalParamType.THETA,
      this.pos
    );
    this.pos.radius = lmt.clampPosition(
      TargetParam_1.SphericalParamType.R,
      this.pos
    );
    if (targetPos) {
      this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
    }
    this.dispatchUpdateEvent();
  };
  /**
   * カメラの位置ずれ設定を行う。
   * @param {Vector3} shift
   */
  SphericalController.prototype.initCameraShift = function(shift) {
    this.cameraShift = shift.clone();
    this.dispatchUpdateEvent();
  };
  /**
   * カメラを任意の位置に移動する
   * @param pos
   * @param option
   */
  SphericalController.prototype.move = function(pos, option) {
    option = EasingOption_1.EasingOption.init(option, this);
    this.tweens.stop();
    this.movePosition(TargetParam_1.SphericalParamType.R, pos.radius, option);
    this.movePosition(TargetParam_1.SphericalParamType.PHI, pos.phi, option);
    this.movePosition(
      TargetParam_1.SphericalParamType.THETA,
      pos.theta,
      option
    );
  };
  /**
   * カメラターゲットの変更
   * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。
   * @param _target
   */
  SphericalController.prototype.changeTarget = function(_target) {
    this._cameraTarget = _target;
    // ここでダミーのカメラターゲットをシーン直下に生成
    // 両ターゲット間をtweenさせる。
    // 座標はworld座標に変換して統一。
    // tweenが終了したらthis._cameraTargetを差し替え。
  };
  /**
   * カメラ座標のうち、typeで指定された１つのパラメーターを移動する
   * @param type
   * @param value
   * @param option
   */
  SphericalController.prototype.movePosition = function(type, value, option) {
    option = EasingOption_1.EasingOption.init(option, this);
    if (type === TargetParam_1.SphericalParamType.THETA && option.normalize) {
      value = SphericalControllerUtil_1.SphericalControllerUtil.getTweenTheta(
        this.pos.theta,
        value
      );
    }
    var to = this.limiter.clampWithType(type, value);
    this.tweens.overrideTween(type, this.getTweenPosition(type, to, option));
  };
  /**
   * movePosition関数用のtweenオブジェクトを生成する。
   * @param targetParam
   * @param to
   * @param option
   */
  SphericalController.prototype.getTweenPosition = function(
    targetParam,
    to,
    option
  ) {
    var _this = this;
    var toObj = {};
    toObj[targetParam] = to;
    var tween = new tween_js_1.default.Tween(this.pos)
      .to(toObj, option.duration)
      .easing(option.easing)
      .onUpdate(this.dispatchUpdateEvent)
      .onComplete(function() {
        _this.onCompleteCameraTween(targetParam);
      })
      .start();
    return tween;
  };
  /**
   * Tweenのcompleteイベントで呼び出される関数。
   * MOVED_CAMERA_COMPLETEイベントを発行する。
   * @param paramType
   */
  SphericalController.prototype.onCompleteCameraTween = function(paramType) {
    this.dispatchEvent(
      new SphericalControllerEvent_1.SphericalControllerEvent(
        SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
        paramType
      )
    );
  };
  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  SphericalController.prototype.moveTarget = function(value, option) {
    option = EasingOption_1.EasingOption.init(option, this);
    var tween = new tween_js_1.default.Tween(this._cameraTarget.position)
      .to({ x: value.x, y: value.y, z: value.z }, option.duration)
      .easing(option.easing)
      .onUpdate(this.dispatchUpdateEvent)
      .start();
    this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_TARGET, tween);
  };
  SphericalController.prototype.stopLoop = function(type) {
    this.tweens.stopTween(type);
  };
  /**
   * カメラ位置をループで移動させる。
   * ゆらゆらと動かすための処理。
   * @param type どのプロパティを操作するか。
   * @param min
   * @param max
   * @param option このアニメーションに対する1回限りの設定を行う。
   */
  SphericalController.prototype.loop = function(type, min, max, option) {
    var _this = this;
    if (type === TargetParam_1.SphericalParamType.THETA) {
      this.pos.theta = SphericalControllerUtil_1.SphericalControllerUtil.PI2ToPI(
        this.pos.theta
      );
    }
    option = EasingOption_1.EasingOption.init(option, this, true);
    var toMin = this.limiter.clampWithType(type, min);
    var toMax = this.limiter.clampWithType(type, max);
    var toObjMax = {};
    toObjMax[type] = toMax;
    var toObjMin = {};
    toObjMin[type] = toMin;
    var loop = function() {
      var tween = new tween_js_1.default.Tween(_this.pos)
        .to(toObjMax, option.duration)
        .yoyo(true)
        .easing(option.easing)
        .onUpdate(_this.dispatchUpdateEvent)
        .repeat(Infinity)
        .start();
      _this.tweens.overrideTween(type, tween);
    };
    var firstDuration = SphericalControllerUtil_1.SphericalControllerUtil.getFirstDuration(
      option.duration,
      this.pos[type],
      toMax,
      toMin
    );
    var tween = new tween_js_1.default.Tween(this.pos)
      .easing(option.easing)
      .to(toObjMin, firstDuration)
      .onUpdate(this.dispatchUpdateEvent)
      .onComplete(loop)
      .start();
    this.tweens.overrideTween(type, tween);
  };
  /**
   * カメラシフトを移動する
   * @param value 移動先
   * @param option
   */
  SphericalController.prototype.moveCameraShift = function(value, option) {
    option = EasingOption_1.EasingOption.init(option, this);
    var tween = new tween_js_1.default.Tween(this.cameraShift)
      .easing(option.easing)
      .to({ x: value.x, y: value.y, z: value.z }, option.duration)
      .onUpdate(this.dispatchUpdateEvent)
      .start();
    this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_SHIFT, tween);
  };
  /**
   * カメラターゲットの座標を加算する。
   * 水平、垂直移動などに使用
   * @param pos
   * @param overrideTween
   */
  SphericalController.prototype.addTargetPosition = function(
    pos,
    overrideTween
  ) {
    if (overrideTween === void 0) {
      overrideTween = false;
    }
    if (!overrideTween && this.tweens.isPlaying()) return;
    if (overrideTween && this.tweens.isPlaying()) {
      this.tweens.stop();
    }
    this._cameraTarget.position.add(pos);
    this.dispatchUpdateEvent();
  };
  /**
   * カメラのSpherical座標に加算する。
   * @param type
   * @param value
   * @param overrideTween
   */
  SphericalController.prototype.addPosition = function(
    type,
    value,
    overrideTween
  ) {
    if (overrideTween === void 0) {
      overrideTween = false;
    }
    if (!overrideTween && this.tweens.isPlaying()) return;
    if (overrideTween && this.tweens.isPlaying()) {
      this.tweens.stop();
    }
    this.pos[type] += value;
    this.pos[type] = this.limiter.clampPosition(type, this.pos);
    this.dispatchUpdateEvent();
  };
  return SphericalController;
})(three_1.EventDispatcher);
exports.SphericalController = SphericalController;
