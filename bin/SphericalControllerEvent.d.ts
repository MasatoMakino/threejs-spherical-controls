export declare class SphericalControllerEvent {
    type: SphericalControllerEventType;
    targetParam: TargetParam | SphericalParamType;
    constructor(type: SphericalControllerEventType, targetParam?: TargetParam | SphericalParamType);
}
export declare enum SphericalControllerEventType {
    MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA",
    MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"
}
export declare enum TargetParam {
    CAMERA_TARGET = "cameraTarget",
    CAMERA_SHIFT = "CameraShift"
}
export declare enum SphericalParamType {
    R = "radius",
    PHI = "phi",
    THETA = "theta"
}
//# sourceMappingURL=SphericalControllerEvent.d.ts.map