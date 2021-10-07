import { Mesh, Spherical, Vector3 } from "three";
import { Event } from "three";
export declare class CameraUpdateEvent implements Event {
    type: CameraUpdateEventType;
    cameraTarget: Mesh;
    position: Spherical;
    shift: Vector3;
    constructor(type: CameraUpdateEventType, cameraTarget: Mesh, position: Spherical, shift: Vector3);
}
export declare enum CameraUpdateEventType {
    UPDATE = "CameraEvent_TYPE_UPDATE"
}
//# sourceMappingURL=CameraUpdateEvent.d.ts.map