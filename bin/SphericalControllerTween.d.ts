/// <reference types="tweenjs" />
import Tween = createjs.Tween;
import { TargetParam } from "./SphericalControllerEvent";
import { SphericalParamType } from "./SphericalControllerEvent";
export declare class SphericalControllerTween {
    private _tweenTarget;
    private _tweenR;
    private _tweenTheta;
    private _tweenPhi;
    private _tweenCameraShift;
    duration: number;
    easing: (amount: number) => number;
    loopEasing: (amount: number) => number;
    constructor();
    stopTween(type: TargetParam | SphericalParamType): void;
    getTween(type: TargetParam | SphericalParamType): Tween;
    setTween(type: TargetParam | SphericalParamType, tween: Tween | null): void;
    overrideTween(type: TargetParam | SphericalParamType, tween: Tween | null): void;
    getTweenArray(): Tween[];
    /**
     * 現在アクティブなTweenが存在するか確認する。
     */
    isPlaying(): boolean;
    /**
     * 全てのtweenインスタンスを停止する。
     */
    stop(): void;
}
//# sourceMappingURL=SphericalControllerTween.d.ts.map