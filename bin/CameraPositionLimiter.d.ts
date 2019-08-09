import { Spherical } from "three";
import { SphericalParamType } from "./TargetParam";
export declare class CameraPositionLimiter {
    private static readonly EPS;
    phiMin: number;
    phiMax: number;
    thetaMin: number;
    thetaMax: number;
    constructor();
    setLimit(type: SphericalParamType, max: number, min: number): void;
    clampWithType(type: SphericalParamType, val: number): number;
    clampPosition(type: SphericalParamType, pos: Spherical): number;
    static clamp(value: number, max: number, min: number): number;
}
//# sourceMappingURL=CameraPositionLimiter.d.ts.map