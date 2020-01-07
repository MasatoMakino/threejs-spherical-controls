"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[SphericalController]]が管理する、どのオブジェクトを操作するかを指定する定数。
 *
 * ```typescript
 * controller.tweens.stopTween(TargetParam.CAMERA_TARGET);
 * // -> カメラターゲットメッシュの移動を停止する。
 * ```
 *
 * [[SphericalParamType]]定数と合わせて、どの対象を操作するかを指定する。
 */
var TargetParam;
(function(TargetParam) {
  TargetParam["CAMERA_TARGET"] = "cameraTarget";
  TargetParam["CAMERA_SHIFT"] = "cameraShift";
})((TargetParam = exports.TargetParam || (exports.TargetParam = {})));
/**
 * Spherical型の座標のうち、どのパラメーターを操作するかを指定する定数。
 * 定数はTHREE.Spherical.*のいずれかのメンバーに対応する。
 *
 * ```typescript
 * controller.addPosition(SphericalParamType.R, 1.0);
 * // -> 半径に1.0加算される。
 * ```
 *
 * [[TargetParam]]定数と合わせて、どの対象を操作するかを指定する。
 */
var SphericalParamType;
(function(SphericalParamType) {
  SphericalParamType["R"] = "radius";
  SphericalParamType["PHI"] = "phi";
  SphericalParamType["THETA"] = "theta";
})(
  (SphericalParamType =
    exports.SphericalParamType || (exports.SphericalParamType = {}))
);
