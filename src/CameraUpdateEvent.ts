import type { Mesh, Spherical, Vector3 } from "three";

export interface CameraUpdateEventMap {
  update: (e: CameraUpdateEvent) => void;
}

/**
 * カメラ位置が更新された場合に発行されるイベント
 * RAFで間引きされて発行される。
 * レンダリングを間引く目的などで利用される。
 * TODO : SphericalControllerEventとCameraUpdateEventを一本化できないか検討する
 */
export interface CameraUpdateEvent {
  type: keyof CameraUpdateEventMap;
  cameraTarget: Mesh;
  position: Spherical;
  shift: Vector3;
}
