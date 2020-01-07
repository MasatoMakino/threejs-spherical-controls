"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var SphericalControllerEvent_1 = require("./SphericalControllerEvent");
var CameraUpdateEvent_1 = require("./CameraUpdateEvent");
var raf_ticker_1 = require("raf-ticker");
var CameraPositionUpdater = /** @class */ (function() {
  function CameraPositionUpdater(parent, camera, target) {
    var _this = this;
    this.isUpdate = false;
    /**
     * tweenによる更新フラグ処理
     * イベントハンドラーで処理できるように関数とする。
     * @param e
     */
    this.setNeedUpdate = function(e) {
      _this.isUpdate = true;
      _this.updateEvent = e;
    };
    /**
     * カメラ位置および注視点の更新処理
     */
    this.updatePosition = function() {
      if (!_this.isUpdate) return;
      _this.isUpdate = false;
      var e = _this.updateEvent;
      var cameraTargetPos = new three_1.Vector3();
      var cameraPos = _this._camera.position;
      cameraPos.setFromSpherical(e.position);
      cameraPos.add(e.cameraTarget.getWorldPosition(cameraTargetPos));
      _this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
      _this._camera.lookAt(e.cameraTarget.getWorldPosition(cameraTargetPos));
      if (e.shift) {
        var pos = _this._camera.position.clone();
        var move = new three_1.Vector3(e.shift.x, e.shift.y, e.shift.z);
        move.applyEuler(_this._camera.rotation.clone());
        pos.add(move);
        _this._camera.position.set(pos.x, pos.y, pos.z);
      }
      _this.dispatcher.dispatchEvent(
        new SphericalControllerEvent_1.SphericalControllerEvent(
          SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA
        )
      );
    };
    this.dispatcher = parent;
    this._camera = camera;
    this.dispatcher.addEventListener(
      CameraUpdateEvent_1.CameraUpdateEventType.UPDATE,
      this.setNeedUpdate
    );
    raf_ticker_1.RAFTicker.addEventListener(
      raf_ticker_1.RAFTickerEventType.onBeforeTick,
      function(e) {
        _this.updatePosition();
      }
    );
  }
  return CameraPositionUpdater;
})();
exports.CameraPositionUpdater = CameraPositionUpdater;
