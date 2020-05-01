"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraUpdateEvent = /** @class */ (function () {
    function CameraUpdateEvent(type, cameraTarget, position, shift) {
        this.type = type;
        this.cameraTarget = cameraTarget;
        this.position = position;
        this.shift = shift;
    }
    return CameraUpdateEvent;
}());
exports.CameraUpdateEvent = CameraUpdateEvent;
var CameraUpdateEventType;
(function (CameraUpdateEventType) {
    CameraUpdateEventType["UPDATE"] = "CameraEvent_TYPE_UPDATE"; //カメラが移動した
})(CameraUpdateEventType = exports.CameraUpdateEventType || (exports.CameraUpdateEventType = {}));
