"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TargetParam_1 = require("./TargetParam");
var CameraPositionLimiter = /** @class */ (function() {
  function CameraPositionLimiter() {
    this.phiMin = CameraPositionLimiter.EPS;
    this.phiMax = Math.PI - CameraPositionLimiter.EPS;
    this.thetaMin = null;
    this.thetaMax = null;
    this.rMax = Number.MAX_VALUE;
    this.rMin = CameraPositionLimiter.EPS;
  }
  CameraPositionLimiter.prototype.setLimit = function(type, max, min) {
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
  };
  CameraPositionLimiter.prototype.clampWithType = function(type, val) {
    switch (type) {
      case TargetParam_1.SphericalParamType.PHI:
        return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);
      case TargetParam_1.SphericalParamType.THETA:
        return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);
      case TargetParam_1.SphericalParamType.R:
        return CameraPositionLimiter.clamp(val, this.rMax, this.rMin);
    }
    return val;
  };
  CameraPositionLimiter.prototype.clampPosition = function(type, pos) {
    var val = pos[type];
    return this.clampWithType(type, val);
  };
  CameraPositionLimiter.clamp = function(value, max, min) {
    if (min == null || max == null) return value;
    value = Math.min(value, max);
    value = Math.max(value, min);
    return value;
  };
  CameraPositionLimiter.EPS = 0.000001;
  return CameraPositionLimiter;
})();
exports.CameraPositionLimiter = CameraPositionLimiter;
