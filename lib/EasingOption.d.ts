import { SphericalController } from "./SphericalController";
/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export declare class EasingOption {
  duration?: number;
  easing?: Function;
  normalize?: boolean;
  static init(
    option: EasingOption,
    controller: SphericalController,
    isLoop?: boolean
  ): EasingOption;
  private static supplement;
}
//# sourceMappingURL=EasingOption.d.ts.map
