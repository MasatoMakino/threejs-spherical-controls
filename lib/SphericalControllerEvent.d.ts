import { SphericalParamType, TargetParam } from "./TargetParam";
import { Event } from "three";
export declare class SphericalControllerEvent implements Event {
    type: SphericalControllerEventType;
    targetParam: TargetParam | SphericalParamType;
    constructor(type: SphericalControllerEventType, targetParam?: TargetParam | SphericalParamType);
}
export declare enum SphericalControllerEventType {
    MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA",
    MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE"
}
//# sourceMappingURL=SphericalControllerEvent.d.ts.map