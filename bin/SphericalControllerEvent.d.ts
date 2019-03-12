export declare class SphericalControllerEvent {
    type: SphericalControllerEventType;
    targetParam: TargetParam;
    constructor(type: SphericalControllerEventType, targetParam?: TargetParam);
}
export declare enum SphericalControllerEventType {
    MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA",
    MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"
}
export declare enum TargetParam {
    R = "TargetParam_R",
    PHI = "TargetParam_Phi",
    THETA = "TargetParam_Theta"
}
//# sourceMappingURL=SphericalControllerEvent.d.ts.map