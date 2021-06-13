"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SphericalControllerEventType = exports.SphericalControllerEvent = void 0;
class SphericalControllerEvent {
    constructor(type, targetParam) {
        this.type = type;
        this.targetParam = targetParam;
    }
}
exports.SphericalControllerEvent = SphericalControllerEvent;
var SphericalControllerEventType;
(function (SphericalControllerEventType) {
    SphericalControllerEventType["MOVED_CAMERA"] = "CameraEvent_TYPE_MOVED_CAMERA";
    SphericalControllerEventType["MOVED_CAMERA_COMPLETE"] = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"; //カメラ移動アニメーションが完了した
})(SphericalControllerEventType = exports.SphericalControllerEventType || (exports.SphericalControllerEventType = {}));
