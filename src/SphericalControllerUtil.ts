import Tween = createjs.Tween;

export class SphericalControllerUtil {
  /**
   * 指定されたtweenを停止する。
   * @param {createjs.Tween | null} tween
   * @return {null}
   */
  public static removeTween(tween: Tween | null): null {
    if (!tween) return null;
    tween.paused = true;
    tween.removeAllEventListeners();
    return null;
  }

  /**
   * 任意の点までの回転アニメーションに必要になる
   * 回転方向を算出する処理。
   *
   * @param from
   * @param to
   * @returns {number}    最短距離での目標となる回転角
   */
  public static getTweenTheta(from: number, to: number): number {
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
  public static PI2ToPI(value: number) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }
}
