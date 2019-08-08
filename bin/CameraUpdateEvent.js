export class CameraUpdateEvent {
    constructor(type, cameraTarget, position, shift) {
        this.type = type;
        this.cameraTarget = cameraTarget;
        this.position = position;
        this.shift = shift;
    }
}
export var CameraUpdateEventType;
(function (CameraUpdateEventType) {
    CameraUpdateEventType["UPDATE"] = "CameraEvent_TYPE_UPDATE"; //カメラが移動した
})(CameraUpdateEventType || (CameraUpdateEventType = {}));
