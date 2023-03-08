import { SphericalParamType, TargetParam } from "./TargetParam";
import { Event } from "three";

export class SphericalControllerEvent implements Event {
  type: SphericalControllerEventType;
  public targetParam: TargetParam | SphericalParamType;
  constructor(
    type: SphericalControllerEventType,
    targetParam?: TargetParam | SphericalParamType
  ) {
    this.type = type;
    this.targetParam = targetParam;
  }
}

export type SphericalControllerEventType =
  | "moved_camera"
  | "moved_camera_complete";
