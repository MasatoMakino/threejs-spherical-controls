export class SphericalControllerEvent {
  public type: SphericalControllerEventType;
  public targetParam: TargetParam;
  constructor(type: SphericalControllerEventType, targetParam?: TargetParam) {
    this.type = type;
    this.targetParam = targetParam;
  }
}

export enum SphericalControllerEventType {
  MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA", //カメラが移動した
  MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE" //カメラ移動アニメーションが完了した
}

export enum TargetParam {
  R = "radius",
  PHI = "phi",
  THETA = "theta",
  CAMERA_TARGET = "cameraTarget",
  CAMERA_SHIFT = "CameraShift"
}
