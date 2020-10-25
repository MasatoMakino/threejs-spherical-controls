import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";

export class SphericalControllerUtil {
    /**
     * 任意の点までの回転アニメーションに必要になる
     * 回転方向を算出する処理。
     *
     * @param from
     * @param to
     * @returns {number}    最短距離での目標となる回転角
     */
    static getTweenTheta(from, to) {
        to = this.PI2ToPI(to);
        let fromDif = this.PI2ToPI(from);
        fromDif = this.PI2ToPI(to - fromDif);
        return from + fromDif;
    }
    /**
     * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。
     * Math.PIもしくは-Math.PIを入力すると正負が反転する。
     * @param {number} value
     * @return {number}
     * @constructor
     */
    static PI2ToPI(value) {
        return Math.atan2(Math.sin(value), Math.cos(value));
    }
    /**
     * loopアニメーションの初回振幅のdurationを算出する
     * @param duration
     * @param current
     * @param max
     * @param min
     */
    static getFirstDuration(duration, current, max, min) {
        return Math.abs(duration * ((current - min) / (max - min)));
    }
    static generateCameraTarget() {
        const geo = new SphereBufferGeometry(1, 3, 3);
        const mat = new MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.0,
            transparent: true,
        });
        return new Mesh(geo, mat);
    }
}
