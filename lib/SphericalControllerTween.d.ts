import { Tween } from "@tweenjs/tween.js";
import { SphericalParamType, TargetParam } from "./TargetParam";
import { Spherical } from "three";
import { Vector3 } from "three";

export declare type TweenMapKey = SphericalParamType | TargetParam;
export declare type TweenType = Spherical | Vector3;
/**
 * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。
 * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。
 */
export declare class SphericalControllerTween {
    private tweenMap;
    duration: number;
    easing: (amount: number) => number;
    loopEasing: (amount: number) => number;
    constructor();
    /**
     * 指定されたTweenを停止する。
     * @param type
     */
    stopTween(type: TargetParam | SphericalParamType): void;
    /**
     * 指定されたTweenを停止し、受け取ったTweenで上書きする。
     * @param type
     * @param tween
     */
    overrideTween(type: TweenMapKey, tween?: Tween<TweenType>): void;
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