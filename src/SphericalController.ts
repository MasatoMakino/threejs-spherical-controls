import {
  RAFTicker,
  type RAFTickerEventContext,
} from "@masatomakino/raf-ticker";
import { Tween } from "@tweenjs/tween.js";
import EventEmitter from "eventemitter3";
import { type Camera, type Mesh, Spherical, Vector3 } from "three";
import {
  CameraPositionLimiter,
  CameraPositionUpdater,
  type CameraUpdateEvent,
  type CameraUpdateEventMap,
  EasingOption,
  type SphericalControllerEventMap,
  SphericalControllerTween,
  type SphericalParamType,
  type TargetParam,
  getTweenTheta,
  PI2ToPI,
  getFirstDuration,
} from "./index.js";

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
export class SphericalController extends EventEmitter<
  CameraUpdateEventMap | SphericalControllerEventMap
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
    if (!this._cameraTarget.geometry) {
      console.warn("No geometry for camera target object.");
    }

    this.cameraUpdater = new CameraPositionUpdater(this, camera);

    RAFTicker.on("tick", this.onTick);
  }

  private onTick = (e: RAFTickerEventContext) => {
    this.tweens.update(e);
  };

  public dispatchUpdateEvent = () => {
    const e: CameraUpdateEvent = {
      type: "update",
      cameraTarget: this._cameraTarget,
      position: this.pos,
      shift: this.cameraShift,
    };
    this.emit(e.type, e);
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
    const requiredOption = EasingOption.init(option, this);
    this.tweens.stop();
    this.movePosition("radius", pos.radius, requiredOption);
    this.movePosition("phi", pos.phi, requiredOption);
    this.movePosition("theta", pos.theta, requiredOption);
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
    option?: EasingOption,
  ): void {
    const requiredOption = EasingOption.init(option, this);

    let adjustedValue = value;
    if (type === "theta" && requiredOption.normalize) {
      adjustedValue = getTweenTheta(this.pos.theta, value);
    }
    const to = this.limiter.clampWithType(type, adjustedValue);
    this.tweens.overrideTween(
      type,
      this.getTweenPosition(type, to, requiredOption),
    );
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
    option: EasingOption,
  ): Tween<Spherical> {
    const toObj: { [key: string]: number } = {};
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
    paramType: TargetParam | SphericalParamType,
  ): void {
    this.emit("moved_camera_complete", {
      type: "moved_camera_complete",
      completedParam: paramType,
    });
  }
  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTarget(value: Vector3, option?: EasingOption): void {
    const requiredOption = EasingOption.init(option, this);

    const tween = new Tween(this._cameraTarget.position)
      .to({ x: value.x, y: value.y, z: value.z }, requiredOption.duration)
      .easing(requiredOption.easing)
      .onUpdate(this.dispatchUpdateEvent)
      .start(requiredOption.startTime);
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
    option?: EasingOption,
  ): void {
    if (type === "theta") {
      this.pos.theta = PI2ToPI(this.pos.theta);
    }
    const requiredOption = EasingOption.init(option, this, true);

    const toMin = this.limiter.clampWithType(type, min);
    const toMax = this.limiter.clampWithType(type, max);
    const toObjMax: { [key: string]: number } = {};
    toObjMax[type] = toMax;
    const toObjMin: { [key: string]: number } = {};
    toObjMin[type] = toMin;

    const loop = (
      to: { [key: string]: number },
      startTime: number | undefined,
    ) => {
      const nextStartTime =
        startTime == null ? undefined : startTime + requiredOption.duration;

      const tween = new Tween(this.pos)
        .to(to, requiredOption.duration)
        .easing(requiredOption.easing)
        .onUpdate(this.dispatchUpdateEvent)
        .onComplete(() => {
          loop(to === toObjMax ? toObjMin : toObjMax, nextStartTime);
        })
        .start(startTime);
      this.tweens.overrideTween(type, tween);
    };

    const firstDuration = getFirstDuration(
      requiredOption.duration,
      this.pos[type],
      toMax,
      toMin,
    );

    const nextStartTime =
      requiredOption.startTime == null
        ? undefined
        : requiredOption.startTime + firstDuration;

    const tween = new Tween(this.pos)
      .easing(requiredOption.easing)
      .to(toObjMin, firstDuration)
      .onUpdate(this.dispatchUpdateEvent)
      .onComplete(() => {
        loop(toObjMax, nextStartTime);
      })
      .start(requiredOption.startTime);
    this.tweens.overrideTween(type, tween);
  }

  /**
   * カメラシフトを移動する
   * @param value 移動先
   * @param option
   */
  public moveCameraShift(value: Vector3, option?: EasingOption): void {
    const requiredOption = EasingOption.init(option, this);

    const tween = new Tween(this.cameraShift)
      .easing(requiredOption.easing)
      .to({ x: value.x, y: value.y, z: value.z }, requiredOption.duration)
      .onUpdate(this.dispatchUpdateEvent)
      .start(requiredOption.startTime);
    this.tweens.overrideTween("camera_shift", tween);
  }

  /**
   * カメラターゲットの座標を加算する。
   * 水平、垂直移動などに使用
   * @param pos
   * @param overrideTween
   */
  public addTargetPosition(pos: Vector3, overrideTween = false): void {
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
    overrideTween = false,
    addDuringTween = false,
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

  public dispose(): void {
    RAFTicker.off("tick", this.onTick);
    this.cameraUpdater.dispose();
    this.tweens.stop();
    this.removeAllListeners();
  }
}
