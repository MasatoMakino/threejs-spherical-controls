export declare class CameraPosition {
    private _position;
    private tweens;
    private dispatchUpdateEvent;
    /**
     * 半径を加算する。
     * ズームインアウトを行う際のメソッド
     * @param value
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addR(value: number, overrideTween?: boolean): void;
    /**
     * 経度を加算する。
     * 横方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addTheta(value: number, overrideTween?: boolean): void;
    /**
     * 緯度を加算する
     * 縦方向回転を行う際のメソッド
     * @param value 単位はラジアン角
     * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
     */
    addPhi(value: number, overrideTween?: boolean): void;
    /**
     * カメラのSpherical座標に加算する。
     * @param targetParam
     * @param value
     * @param overrideTween
     */
    private addPosition;
}
//# sourceMappingURL=CameraPosition.d.ts.map