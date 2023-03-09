import { SphericalParamType, TargetParam } from "./TargetParam";
import { Event } from "three";

/**
 * カメラが移動した際に発行されるイベント
 * 主にSphericalController内で利用される。
 *
 * SphericalController外でカメラの移動を検知するためにはCameraUpdateEventを利用する。
 * TODO : SphericalControllerEventとCameraUpdateEventを一本化できないか検討する
 */
export interface SphericalControllerEvent extends Event {
  type: SphericalControllerEventType;
  completedParam?: TargetParam | SphericalParamType;
}

export type SphericalControllerEventType =
  | "moved_camera"
  | "moved_camera_complete";
