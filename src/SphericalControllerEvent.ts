export class SphericalControllerEvent {
  public type: SphericalControllerEventType;

  constructor(type: SphericalControllerEventType) {
    this.type = type;
  }
}

export enum SphericalControllerEventType {
  MOVED_CAMERA = "CameraEvent_TYPE_MOVED_CAMERA", //カメラが移動した
  MOVED_CAMERA_COMPLETE = "CameraEvent_TYPE_MOVED_CAMERA_COMPLETE" //カメラ移動アニメーションが完了した
}
