"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraUpdateEventType = exports.CameraUpdateEvent = void 0;
class CameraUpdateEvent {
    constructor(type, cameraTarget, position, shift) {
        this.type = type;
        this.cameraTarget = cameraTarget;
        this.position = position;
        this.shift = shift;
    }
}
exports.CameraUpdateEvent = CameraUpdateEvent;
var CameraUpdateEventType;
(function (CameraUpdateEventType) {
    CameraUpdateEventType["UPDATE"] = "CameraEvent_TYPE_UPDATE";
})(CameraUpdateEventType = exports.CameraUpdateEventType || (exports.CameraUpdateEventType = {}));
