import { Event, Mesh, Spherical, Vector3 } from "three";

export class CameraUpdateEvent implements Event {
  type: CameraUpdateEventType;

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

export type CameraUpdateEventType = "update";
