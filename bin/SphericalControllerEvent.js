export class SphericalControllerEvent {
    constructor(type, targetParam) {
        this.type = type;
        this.targetParam = targetParam;
    }
}
export var SphericalControllerEventType;
(function (SphericalControllerEventType) {
    SphericalControllerEventType["MOVED_CAMERA"] = "CameraEvent_TYPE_MOVED_CAMERA";
    SphericalControllerEventType["MOVED_CAMERA_COMPLETE"] = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"; //カメラ移動アニメーションが完了した
})(SphericalControllerEventType || (SphericalControllerEventType = {}));
export var TargetParam;
(function (TargetParam) {
    TargetParam["CAMERA_TARGET"] = "cameraTarget";
    TargetParam["CAMERA_SHIFT"] = "CameraShift";
})(TargetParam || (TargetParam = {}));
export var SphericalParamType;
(function (SphericalParamType) {
    SphericalParamType["R"] = "radius";
    SphericalParamType["PHI"] = "phi";
    SphericalParamType["THETA"] = "theta";
})(SphericalParamType || (SphericalParamType = {}));
