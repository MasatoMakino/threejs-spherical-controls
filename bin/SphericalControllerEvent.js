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
    TargetParam["R"] = "TargetParam_R";
    TargetParam["PHI"] = "TargetParam_Phi";
    TargetParam["THETA"] = "TargetParam_Theta";
})(TargetParam || (TargetParam = {}));
