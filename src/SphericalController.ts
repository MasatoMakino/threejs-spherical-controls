import Tween = createjs.Tween;
import {
  Camera,
  EventDispatcher,
  Mesh,
  MeshBasicMaterial,
  Spherical,
  Vector3
} from "three";
import {
  SphericalControllerEvent,
  SphericalControllerEventType
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
export class SphericalController extends EventDispatcher {
  private cameraUpdater: CameraPositionUpdater;

  private _cameraTarget: Mesh;
  private pos: Spherical = new Spherical();
  //画面のシフト
  // 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
  // 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
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
    this._cameraTarget.material = new MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.0,
      transparent: true
    });

    this.cameraUpdater = new CameraPositionUpdater(
      this,
      camera,
      this._cameraTarget
    );
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
    this.pos = pos;
    const lmt = this.limiter;
    this.pos.phi = lmt.clampPosition(SphericalParamType.PHI, this.pos);
    this.pos.theta = lmt.clampPosition(SphericalParamType.THETA, this.pos);
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
    this.moveR(pos.radius, option);
    this.movePhi(pos.phi, option);
    this.moveTheta(pos.theta, option);
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
   * 半径のみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  public moveR(value: number, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    this.tweens.overrideTween(
      SphericalParamType.R,
      this.getTweenPosition(SphericalParamType.R, value, option)
    );
  }

  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTarget(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    const tween = Tween.get(this._cameraTarget.position).to(
      { x: value.x, y: value.y, z: value.z },
      option.duration,
      option.easing
    );
    tween.addEventListener("change", this.dispatchUpdateEvent);
    this.tweens.overrideTween(TargetParam.CAMERA_TARGET, tween);
  }

  /**
   * 経度のみを移動する
   * 横向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTheta(value: number, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    let to = value;
    if (option.normalize) {
      to = SphericalControllerUtil.getTweenTheta(this.pos.theta, value);
    }
    to = this.limiter.clampWithType(SphericalParamType.THETA, to);

    const tween = this.getTweenPosition(SphericalParamType.THETA, to, option);
    this.tweens.overrideTween(SphericalParamType.THETA, tween);
  }

  private getTweenPosition(
    targetParam: TargetParam | SphericalParamType,
    to: number,
    option: EasingOption
  ): Tween {
    const toObj = {};
    toObj[targetParam] = to;

    const tween = Tween.get(this.pos).to(toObj, option.duration, option.easing);
    tween.addEventListener("change", this.dispatchUpdateEvent);
    tween.addEventListener("complete", e => {
      this.onCompleteCameraTween(targetParam);
    });
    return tween;
  }

  private onCompleteCameraTween(
    paramType: TargetParam | SphericalParamType
  ): void {
    this.dispatchEvent(
      new SphericalControllerEvent(
        SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
        paramType
      )
    );
  }

  /**
   * 緯度のみを移動する
   * 縦方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param option
   */
  public movePhi(value: number, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    const to = this.limiter.clampWithType(SphericalParamType.PHI, value);
    const tween = this.getTweenPosition(SphericalParamType.PHI, to, option);
    this.tweens.overrideTween(SphericalParamType.PHI, tween);
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
    if (type === SphericalParamType.THETA) {
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
      const tween = Tween.get(this.pos, { loop: -1 })
        .to(toObjMax, option.duration, option.easing)
        .to(toObjMin, option.duration, option.easing);
      tween.addEventListener("change", this.dispatchUpdateEvent);
      this.tweens.overrideTween(type, tween);
    };

    const firstDuration = SphericalControllerUtil.getFirstDuration(
      option.duration,
      this.pos[type],
      toMax,
      toMin
    );

    const tween = Tween.get(this.pos)
      .to(toObjMin, firstDuration, option.easing)
      .call(loop);
    tween.addEventListener("change", this.dispatchUpdateEvent);
    this.tweens.overrideTween(type, tween);
  }

  /**
   * カメラシフトを移動する
   * @param value 移動先
   * @param option
   */
  public moveCameraShift(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    if (!this.cameraShift) {
      this.cameraShift = new Vector3();
    }

    const tween = Tween.get(this.cameraShift).to(
      { x: value.x, y: value.y, z: value.z },
      option.duration,
      option.easing
    );
    tween.addEventListener("change", this.dispatchUpdateEvent);
    this.tweens.overrideTween(TargetParam.CAMERA_SHIFT, tween);
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
   * @param targetParam
   * @param value
   * @param overrideTween
   */
  public addPosition(
    type: SphericalParamType,
    value: number,
    overrideTween: boolean = false
  ): void {
    if (!overrideTween && this.tweens.isPlaying()) return;
    if (overrideTween && this.tweens.isPlaying()) {
      this.tweens.stop();
    }

    this.pos[type] += value;
    this.pos[type] = this.limiter.clampPosition(type, this.pos);
    this.dispatchUpdateEvent();
  }
}
