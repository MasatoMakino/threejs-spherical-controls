import { Mesh } from "three";
export declare class SphericalControllerUtil {
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param from
     * @param to
     * @returns {number}    最短距離での目標となる回転角
     */
    static getTweenTheta(from: number, to: number): number;
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * Math.PIもしくは-Math.PIを入力すると正負が反転する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    static PI2ToPI(value: number): number;
    /**
     * loopアニメーションの初回振幅のdurationを算出する
     * @param duration
     * @param current
     * @param max
     * @param min
     */
    static getFirstDuration(duration: number, current: number, max: number, min: number): number;
    static generateCameraTarget(): Mesh;
}
//# sourceMappingURL=SphericalControllerUtil.d.ts.map