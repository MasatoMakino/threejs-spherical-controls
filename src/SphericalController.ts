import { Tween } from "@tweenjs/tween.js";
import { TWEENTicker } from "@masatomakino/tween.js-ticker";
import { Camera, EventDispatcher, Mesh, Spherical, Vector3 } from "three";
import {
  SphericalControllerEvent,
  SphericalControllerEventType,
} from "./SphericalControllerEvent";
import { SphericalParamType, TargetParam } from "./TargetParam";
import { EasingOption } from "./EasingOption";
import { SphericalControllerUtil } from "./SphericalControllerUtil";
import { CameraPositionLimiter } from "./CameraPositionLimiter";
import { SphericalControllerTween } from "./SphericalControllerTween";
import { CameraPositionUpdater } from "./CameraPositionUpdater";
import { CameraUpdateEvent, CameraUpdateEventType } from "./CameraUpdateEvent";

/**
 * 球面座標系でカメラ位置をコントロールするクラス。
 *
 * カメラ位置はThetaおよびPhiで決定される。
 * 0, 0の場合北極上にカメラが位置する。
 * Phi : 0 ~ Math.PI (縦回転)
 * Theta : -Math.PI ~ Math.PI (横回転)
 * の範囲で可動する。
 *
 * 北極南極を通過すると緯度も反転するため、このクラスでは南北90度以上の移動には対応していない。また、極点上空では座標が一意の値にならないため、Phi 0もしくはPIには対応していない。
 */
export class SphericalController extends EventDispatcher<
  CameraUpdateEvent | SphericalControllerEvent
> {
  private cameraUpdater: CameraPositionUpdater;

  private _cameraTarget: Mesh;
  private pos: Spherical = new Spherical();

  /**
   * 画面のシフト
   * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
   * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
   */
  private cameraShift: Vector3 = new Vector3();

  public tweens: SphericalControllerTween = new SphericalControllerTween();
  public limiter: CameraPositionLimiter = new CameraPositionLimiter();

  /**
   * コンストラクタ
   * @param camera
   * @param target
   */
  constructor(camera: Camera, target: Mesh) {
    super();

    this._cameraTarget = target;
    if (!this._cameraTarget.geometry || !this._cameraTarget.material) {
      console.warn("No geometry or material for camera target object.");
    }

    this.cameraUpdater = new CameraPositionUpdater(this, camera);

    TWEENTicker.start();
  }

  public dispatchUpdateEvent = () => {
    const e = new CameraUpdateEvent(
      CameraUpdateEventType.UPDATE,
      this._cameraTarget,
      this.pos,
      this.cameraShift
    );
    this.dispatchEvent(e);
  };

  /**
   * カメラ位置の初期設定を行う
   * @param pos
   * @param targetPos
   */
  public initCameraPosition(pos: Spherical, targetPos?: Vector3): void {
    this.pos.set(pos.radius, pos.phi, pos.theta);
    const lmt = this.limiter;
    lmt.clampPosition("phi", this.pos);
    lmt.clampPosition("theta", this.pos);
    lmt.clampPosition("radius", this.pos);
    if (targetPos) {
      this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
    }
    this.dispatchUpdateEvent();
  }

  /**
   * カメラの位置ずれ設定を行う。
   * @param {Vector3} shift
   */
  public initCameraShift(shift: Vector3): void {
    this.cameraShift = shift.clone();
    this.dispatchUpdateEvent();
  }

  /**
   * カメラを任意の位置に移動する
   * @param pos
   * @param option
   */
  public move(pos: Spherical, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    this.tweens.stop();
    this.movePosition("radius", pos.radius, option);
    this.movePosition("phi", pos.phi, option);
    this.movePosition("theta", pos.theta, option);
  }

  /**
   * カメラターゲットの変更
   * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。
   * @param _target
   */
  public changeTarget(_target: Mesh): void {
    this._cameraTarget = _target;

    // ここでダミーのカメラターゲットをシーン直下に生成
    // 両ターゲット間をtweenさせる。
    // 座標はworld座標に変換して統一。

    // tweenが終了したらthis._cameraTargetを差し替え。
  }

  /**
   * カメラ座標のうち、typeで指定された１つのパラメーターを移動する
   * @param type
   * @param value
   * @param option
   */
  public movePosition(
    type: SphericalParamType,
    value: number,
    option?: EasingOption
  ): void {
    option = EasingOption.init(option, this);

    if (type === "theta" && option.normalize) {
      value = SphericalControllerUtil.getTweenTheta(this.pos.theta, value);
    }
    const to = this.limiter.clampWithType(type, value);
    this.tweens.overrideTween(type, this.getTweenPosition(type, to, option));
  }

  /**
   * movePosition関数用のtweenオブジェクトを生成する。
   * @param targetParam
   * @param to
   * @param option
   */
  private getTweenPosition(
    targetParam: TargetParam | SphericalParamType,
    to: number,
    option: EasingOption
  ): Tween<Spherical> {
    const toObj = {};
    toObj[targetParam] = to;

    return new Tween(this.pos)
      .to(toObj, option.duration)
      .easing(option.easing)
      .onUpdate(this.dispatchUpdateEvent)
      .onComplete(() => {
        this.onCompleteCameraTween(targetParam);
      })
      .start(option.startTime);
  }

  /**
   * Tweenのcompleteイベントで呼び出される関数。
   * MOVED_CAMERA_COMPLETEイベントを発行する。
   * @param paramType
   */
  private onCompleteCameraTween(
    paramType: TargetParam | SphericalParamType
  ): void {
    this.dispatchEvent(
      new SphericalControllerEvent("moved_camera_complete", paramType)
    );
  }
  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTarget(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    const tween = new Tween(this._cameraTarget.position)
      .to({ x: value.x, y: value.y, z: value.z }, option.duration)
      .easing(option.easing)
      .onUpdate(this.dispatchUpdateEvent)
      .start(option.startTime);
    this.tweens.overrideTween("camera_target", tween);
  }

  public stopLoop(type: SphericalParamType) {
    this.tweens.stopTween(type);
  }

  /**
   * カメラ位置をループで移動させる。
   * ゆらゆらと動かすための処理。
   * @param type どのプロパティを操作するか。
   * @param min
   * @param max
   * @param option このアニメーションに対する1回限りの設定を行う。
   */
  public loop(
    type: SphericalParamType,
    min: number,
    max: number,
    option?: EasingOption
  ): void {
    if (type === "theta") {
      this.pos.theta = SphericalControllerUtil.PI2ToPI(this.pos.theta);
    }
    option = EasingOption.init(option, this, true);

    const toMin = this.limiter.clampWithType(type, min);
    const toMax = this.limiter.clampWithType(type, max);
    const toObjMax = {};
    toObjMax[type] = toMax;
    const toObjMin = {};
    toObjMin[type] = toMin;

    const loop = () => {
      const startTime =
        option.startTime == null ? undefined : option.startTime + firstDuration;
      const tween = new Tween(this.pos)
        .to(toObjMax, option.duration)
        .yoyo(true)
        .easing(option.easing)
        .onUpdate(this.dispatchUpdateEvent)
        .repeat(Infinity)
        .start(startTime);
      this.tweens.overrideTween(type, tween);
    };

    const firstDuration = SphericalControllerUtil.getFirstDuration(
      option.duration,
      this.pos[type],
      toMax,
      toMin
    );

    const tween = new Tween(this.pos)
      .easing(option.easing)
      .to(toObjMin, firstDuration)
      .onUpdate(this.dispatchUpdateEvent)
      .onComplete(loop)
      .start(option.startTime);
    this.tweens.overrideTween(type, tween);
  }

  /**
   * カメラシフトを移動する
   * @param value 移動先
   * @param option
   */
  public moveCameraShift(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    const tween = new Tween(this.cameraShift)
      .easing(option.easing)
      .to({ x: value.x, y: value.y, z: value.z }, option.duration)
      .onUpdate(this.dispatchUpdateEvent)
      .start(option.startTime);
    this.tweens.overrideTween("camera_shift", tween);
  }

  /**
   * カメラターゲットの座標を加算する。
   * 水平、垂直移動などに使用
   * @param pos
   * @param overrideTween
   */
  public addTargetPosition(pos: Vector3, overrideTween: boolean = false): void {
    if (!overrideTween && this.tweens.isPlaying()) return;
    if (overrideTween && this.tweens.isPlaying()) {
      this.tweens.stop();
    }

    this._cameraTarget.position.add(pos);
    this.dispatchUpdateEvent();
  }

  /**
   * カメラのSpherical座標に加算する。
   * @param type
   * @param value
   * @param overrideTween 現在実行中のアニメーションを中断し、座標を上書きするか否か。
   * @param addDuringTween アニメーション中の座標加算を許可するか。許可する場合、typeで指定した値がアニメーションしていなければ加算される。
   */
  public addPosition(
    type: SphericalParamType,
    value: number,
    overrideTween: boolean = false,
    addDuringTween: boolean = false
  ): void {
    if (!overrideTween) {
      if (!addDuringTween && this.tweens.isPlaying()) {
        return;
      }
      if (addDuringTween && this.tweens.isPlayingWithKey(type)) {
        return;
      }
    }

    if (overrideTween && this.tweens.isPlaying()) {
      this.tweens.stop();
    }

    this.pos[type] += value;
    this.limiter.clampPosition(type, this.pos);
    this.dispatchUpdateEvent();
  }

  /**
   * カメラ座標を他のSphericalオブジェクトに転写する。
   * @param spherical
   */
  public copySphericalPosition(spherical: Spherical): Spherical {
    return spherical.copy(this.pos);
  }

  /**
   * カメラ座標を複製する。
   */
  public cloneSphericalPosition(): Spherical {
    return this.pos.clone();
  }
}
