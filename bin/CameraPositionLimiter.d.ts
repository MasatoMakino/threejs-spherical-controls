import { TargetParam } from "./SphericalControllerEvent";
import { Spherical } from "three";
export declare class CameraPositionLimiter {
    private static readonly EPS;
    phiMin: number;
    phiMax: number;
    thetaMin: number;
    thetaMax: number;
    constructor();
    setLimit(type: TargetParam, max: number, min: number): void;
    clampWithType(type: TargetParam, val: number): number;
    clampPosition(type: TargetParam, pos: Spherical): number;
    static clamp(value: number, max: number, min: number): number;
}
//# sourceMappingURL=CameraPositionLimiter.d.ts.map