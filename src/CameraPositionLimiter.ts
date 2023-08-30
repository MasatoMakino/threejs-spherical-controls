import { Spherical } from "three";
import { SphericalParamType } from "./TargetParam";

export class CameraPositionLimiter {
  private static readonly EPS = 0.000001;
  public phiMin: number = CameraPositionLimiter.EPS;
  public phiMax: number = Math.PI - CameraPositionLimiter.EPS;
  public thetaMin: number | undefined = undefined;
  public thetaMax: number | undefined = undefined;
  public rMax: number = Number.MAX_VALUE;
  public rMin: number = CameraPositionLimiter.EPS;

  constructor() {}

  public setLimit(type: SphericalParamType, max: number, min: number) {
    switch (type) {
      case "phi":
        this.phiMax = max;
        this.phiMin = min;
        break;
      case "theta":
        this.thetaMax = max;
        this.thetaMin = min;
        break;
      case "radius":
        this.rMax = max;
        this.rMin = min;
        break;
    }
  }

  public clampWithType(type: SphericalParamType, val: number): number {
    switch (type) {
      case "phi":
        return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);
      case "theta":
        return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);
      case "radius":
        return CameraPositionLimiter.clamp(val, this.rMax, this.rMin);
    }
    return val;
  }

  public clampPosition(type: SphericalParamType, pos: Spherical): void {
    const val = pos[type];
    pos[type] = this.clampWithType(type, val);
  }

  private static clamp(value: number, max?: number, min?: number): number {
    if (min == null || max == null) return value;
    value = Math.min(value, max);
    value = Math.max(value, min);
    return value;
  }
}
