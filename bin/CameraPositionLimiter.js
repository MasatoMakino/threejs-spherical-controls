import { SphericalParamType } from "./TargetParam";
export class CameraPositionLimiter {
    constructor() {
        this.phiMin = CameraPositionLimiter.EPS;
        this.phiMax = Math.PI - CameraPositionLimiter.EPS;
        this.thetaMin = null;
        this.thetaMax = null;
    }
    setLimit(type, max, min) {
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
    clampWithType(type, val) {
        switch (type) {
            case SphericalParamType.PHI:
                return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);
            case SphericalParamType.THETA:
                return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);
        }
        return val;
    }
    clampPosition(type, pos) {
        const val = pos[type];
        return this.clampWithType(type, val);
    }
    static clamp(value, max, min) {
        if (min == null || max == null)
            return value;
        value = Math.min(value, max);
        value = Math.max(value, min);
        return value;
    }
}
CameraPositionLimiter.EPS = 0.000001;
