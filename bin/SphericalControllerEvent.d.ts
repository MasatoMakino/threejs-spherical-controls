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
    R = "radius",
    PHI = "phi",
    THETA = "theta",
    CAMERA_TARGET = "cameraTarget",
    CAMERA_SHIFT = "CameraShift"
}
//# sourceMappingURL=SphericalControllerEvent.d.ts.map