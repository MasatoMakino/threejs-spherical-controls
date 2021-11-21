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

export enum SphericalControllerEventType {
  MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA", //カメラが移動した
  MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE", //カメラ移動アニメーションが完了した
}
