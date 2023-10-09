import { SphericalParamType, TargetParam } from "./index.js";

export interface SphericalControllerEventMap {
  moved_camera: (e: SphericalControllerEvent) => void;
  moved_camera_complete: (e: SphericalControllerEvent) => void;
}

/**
 * カメラが移動した際に発行されるイベント
 * 主にSphericalController内で利用される。
 *
 * SphericalController外でカメラの移動を検知するためにはCameraUpdateEventを利用する。
 * TODO : SphericalControllerEventとCameraUpdateEventを一本化できないか検討する
 */
export interface SphericalControllerEvent {
  type: keyof SphericalControllerEventMap;
  completedParam?: TargetParam | SphericalParamType;
}
