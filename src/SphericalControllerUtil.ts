import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

/**
 * 任意の点までの回転アニメーションに必要になる
 * 回転方向を算出する処理。
 *
 * @param from
 * @param to
 * @returns {number}    最短距離での目標となる回転角
 */
export function getTweenTheta(from: number, to: number): number {
  const normalizedTo = PI2ToPI(to);

  let fromDif = PI2ToPI(from);
  fromDif = PI2ToPI(normalizedTo - fromDif);
  return from + fromDif;
}

/**
 * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
 * Math.PIもしくは-Math.PIを入力すると正負が反転する。
 * @param {number} value
 * @return {number}
 * @constructor
 */
export function PI2ToPI(value: number) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

/**
 * loopアニメーションの初回振幅のdurationを算出する
 * @param duration
 * @param current
 * @param max
 * @param min
 */
export function getFirstDuration(
  duration: number,
  current: number,
  max: number,
  min: number,
): number {
  return Math.abs(duration * ((current - min) / (max - min)));
}

export function generateCameraTarget(): Mesh {
  const geo = new SphereGeometry(1, 3, 3);
  const mat = new MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.0,
    transparent: true,
  });
  return new Mesh(geo, mat);
}
