import { Mesh } from "three";
import { Spherical } from "three";
import { Vector3 } from "three";

export class CameraUpdateEvent {
  public type: CameraUpdateEventType;

  public cameraTarget: Mesh;
  public position: Spherical;
  public shift: Vector3;

  constructor(
    type: CameraUpdateEventType,
    cameraTarget: Mesh,
    position: Spherical,
    shift: Vector3
  ) {
    this.type = type;
    this.cameraTarget = cameraTarget;
    this.position = position;
    this.shift = shift;
  }
}

export enum CameraUpdateEventType {
  UPDATE = "CameraEvent_TYPE_UPDATE" //カメラが移動した
}
