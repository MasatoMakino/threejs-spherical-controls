import { Event, Mesh, Spherical, Vector3 } from "three";

export interface CameraUpdateEvent extends Event {
  type: CameraUpdateEventType;
  cameraTarget: Mesh;
  position: Spherical;
  shift: Vector3;
}

export type CameraUpdateEventType = "update";
