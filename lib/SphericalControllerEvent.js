"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SphericalControllerEvent = /** @class */ (function() {
  function SphericalControllerEvent(type, targetParam) {
    this.type = type;
    this.targetParam = targetParam;
  }
  return SphericalControllerEvent;
})();
exports.SphericalControllerEvent = SphericalControllerEvent;
var SphericalControllerEventType;
(function(SphericalControllerEventType) {
  SphericalControllerEventType["MOVED_CAMERA"] =
    "CameraEvent_TYPE_MOVED_CAMERA";
  SphericalControllerEventType["MOVED_CAMERA_COMPLETE"] =
    "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"; //カメラ移動アニメーションが完了した
})(
  (SphericalControllerEventType =
    exports.SphericalControllerEventType ||
    (exports.SphericalControllerEventType = {}))
);
