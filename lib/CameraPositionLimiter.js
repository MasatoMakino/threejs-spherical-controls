"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraPositionLimiter = void 0;
const TargetParam_1 = require("./TargetParam");
class CameraPositionLimiter {
    constructor() {
        this.phiMin = CameraPositionLimiter.EPS;
        this.phiMax = Math.PI - CameraPositionLimiter.EPS;
        this.thetaMin = null;
        this.thetaMax = null;
        this.rMax = Number.MAX_VALUE;
        this.rMin = CameraPositionLimiter.EPS;
    }
    setLimit(type, max, min) {
        switch (type) {
            case TargetParam_1.SphericalParamType.PHI:
                this.phiMax = max;
                this.phiMin = min;
                break;
            case TargetParam_1.SphericalParamType.THETA:
                this.thetaMax = max;
                this.thetaMin = min;
                break;
        }
    }
    clampWithType(type, val) {
        switch (type) {
            case TargetParam_1.SphericalParamType.PHI:
                return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);
            case TargetParam_1.SphericalParamType.THETA:
                return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);
            case TargetParam_1.SphericalParamType.R:
                return CameraPositionLimiter.clamp(val, this.rMax, this.rMin);
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
exports.CameraPositionLimiter = CameraPositionLimiter;
CameraPositionLimiter.EPS = 0.000001;
