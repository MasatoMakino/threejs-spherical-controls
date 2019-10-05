import { Spherical } from "three";
import { SphericalParamType } from "./TargetParam";

export class CameraPositionLimiter {
  private static readonly EPS = 0.000001;
  public phiMin: number = CameraPositionLimiter.EPS;
  public phiMax: number = Math.PI - CameraPositionLimiter.EPS;
  public thetaMin: number = null;
  public thetaMax: number = null;

  constructor() {}

  public setLimit(type: SphericalParamType, max: number, min: number) {
    switch (type) {
      case SphericalParamType.PHI:
        console.log(type);
        this.phiMax = max;
        this.phiMin = min;
        break;
      case SphericalParamType.THETA:
        this.thetaMax = max;
        this.thetaMin = min;
        break;
    }
  }

  public clampWithType(type: SphericalParamType, val: number): number {
    switch (type) {
      case SphericalParamType.PHI:
        return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);
      case SphericalParamType.THETA:
        return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);
    }
    return val;
  }

  public clampPosition(type: SphericalParamType, pos: Spherical): number {
    const val = pos[type];
    return this.clampWithType(type, val);
  }

  public static clamp(value: number, max: number, min: number): number {
    if (min == null || max == null) return value;
    value = Math.min(value, max);
    value = Math.max(value, min);
    return value;
  }
}