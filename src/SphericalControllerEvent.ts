import { SphericalParamType, TargetParam } from "./TargetParam";
import { Event } from "three";

export interface SphericalControllerEvent extends Event {
  type: SphericalControllerEventType;
  targetParam?: TargetParam | SphericalParamType;
}

export type SphericalControllerEventType =
  | "moved_camera"
  | "moved_camera_complete";
