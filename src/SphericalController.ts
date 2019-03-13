import Tween = createjs.Tween;
import Ease = createjs.Ease;
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
import { TargetParam } from "./SphericalControllerEvent";

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
  private _camera: Camera;
  private _cameraTarget: Mesh;

  //画面のシフト
  // 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。
  // 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。
  private cameraShift: Vector3 = new Vector3();

  //全体移動用tween
  private tweenTarget!: Tween | null;

  //特定パラメーター移動用tween
  private tweenR!: Tween | null;
  private tweenTheta!: Tween | null;
  private tweenPhi!: Tween | null;
  private tweenCameraShift!: Tween | null;

  public duration: number = 1333;
  public easing = Ease.cubicOut;
  public loopEasing = Ease.sineInOut;

  private pos: Spherical = new Spherical();
  private static readonly EPS = 0.000001;
  public phiMin: number = SphericalController.EPS;
  public phiMax: number = Math.PI - SphericalController.EPS;
  public thetaMin: number = null;
  public thetaMax: number = null;

  protected isUpdate: boolean = false;

  /**
   * コンストラクタ
   * @param camera
   * @param target
   */
  constructor(camera: Camera, target: Mesh) {
    super();
    this._camera = camera;
    this._cameraTarget = target;
    this._cameraTarget.material = new MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.0,
      transparent: true
    });
    this._cameraTarget.onBeforeRender = () => {
      this.updatePosition();
    };
  }

  /**
   * カメラ位置の初期設定を行う
   * @param pos
   * @param targetPos
   */
  public initCameraPosition(pos: Spherical, targetPos?: Vector3): void {
    this.pos = pos;
    this.pos.phi = this.limitPhi(this.pos.phi);
    this.pos.theta = this.limitTheta(this.pos.theta);
    if (targetPos) {
      this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
    }
    this.setNeedUpdate();
  }

  /**
   * カメラの位置ずれ設定を行う。
   * @param {Vector3} shift
   */
  public initCameraShift(shift: Vector3): void {
    this.cameraShift = shift.clone();
    this.setNeedUpdate();
  }

  /**
   * カメラを任意の位置に移動する
   * @param pos
   * @param option
   */
  public move(pos: Spherical, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    this.pauseTween();
    this.moveR(pos.radius, option);
    this.movePhi(pos.phi, option);
    this.moveTheta(pos.theta, option);
  }

  /**
   * tweenによる更新フラグ処理
   * イベントハンドラーで処理できるように関数とする。
   * @param e
   */
  private setNeedUpdate = (e?: any) => {
    this.isUpdate = true;
  };

  /**
   * カメラ位置および注視点の更新処理
   */
  private updatePosition = () => {
    if (!this.isUpdate) return;
    this.isUpdate = false;

    let cameraTargetPos = new Vector3();
    let cameraPos = this._camera.position;
    cameraPos.setFromSpherical(this.pos);
    cameraPos.add(this._cameraTarget.getWorldPosition(cameraTargetPos));
    this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    this._camera.lookAt(this._cameraTarget.getWorldPosition(cameraTargetPos));

    if (this.cameraShift) {
      const pos: Vector3 = this._camera.position.clone();
      const move: Vector3 = new Vector3(
        this.cameraShift.x,
        this.cameraShift.y,
        this.cameraShift.z
      );
      move.applyEuler(this._camera.rotation.clone());
      pos.add(move);
      this._camera.position.set(pos.x, pos.y, pos.z);
    }

    this.dispatchEvent(
      new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA)
    );
  };

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
    this.tweenR = SphericalController.removeTween(this.tweenR);

    this.tweenR = Tween.get(this.pos).to(
      { radius: value },
      option.duration,
      option.easing
    );
    this.tweenR.addEventListener("change", this.setNeedUpdate);
    this.tweenR.addEventListener("complete", e => {
      this.dispatchEvent(
        new SphericalControllerEvent(
          SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
          TargetParam.R
        )
      );
    });
  }

  /**
   * カメラ半径のみをループで移動させる。
   * ゆらゆらとズームインアウトさせるための処理
   * @param {number} min
   * @param {number} max
   * @param option
   */
  public loopMoveR(min: number, max: number, option?: EasingOption): void {
    option = EasingOption.init(option, this, true);

    const stopTween = () => {
      this.tweenR = SphericalController.removeTween(this.tweenR);
    };

    const loop = () => {
      stopTween();
      this.tweenR = Tween.get(this.pos, { loop: -1 })
        .to({ radius: max }, option.duration, option.easing)
        .to({ radius: min }, option.duration, option.easing);
      this.tweenR.addEventListener("change", this.setNeedUpdate);
    };

    stopTween();
    const firstDuration = Math.abs(
      option.duration * ((this.pos.radius - min) / (max - min))
    );

    this.tweenR = Tween.get(this.pos)
      .to({ radius: min }, firstDuration, option.easing)
      .call(loop);
    this.tweenR.addEventListener("change", this.setNeedUpdate);
  }

  public stopLoopMoveR(): void {
    this.tweenR = SphericalController.removeTween(this.tweenR);
  }

  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTarget(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    this.tweenTarget = SphericalController.removeTween(this.tweenTarget);

    this.tweenTarget = Tween.get(this._cameraTarget.position).to(
      { x: value.x, y: value.y, z: value.z },
      option.duration,
      option.easing
    );
    this.tweenTarget.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * 経度のみを移動する
   * 横向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param option
   */
  public moveTheta(value: number, option?: EasingOption): void {
    option = EasingOption.init(option, this);
    this.tweenTheta = SphericalController.removeTween(this.tweenTheta);

    let to = value;
    if (option.normalize) {
      to = SphericalController.getTweenTheta(this.pos.theta, value);
    }
    to = this.limitTheta(to);

    this.tweenTheta = Tween.get(this.pos).to(
      { theta: to },
      option.duration,
      option.easing
    );
    this.tweenTheta.addEventListener("change", this.setNeedUpdate);
    this.tweenTheta.addEventListener("complete", e => {
      this.dispatchEvent(
        new SphericalControllerEvent(
          SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
          TargetParam.THETA
        )
      );
    });
  }

  /**
   * 緯度のみを移動する
   * 縦方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param option
   */
  public movePhi(value: number, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    const to = this.limitPhi(value);

    this.tweenPhi = Tween.get(this.pos).to(
      { phi: to },
      option.duration,
      option.easing
    );
    this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    this.tweenPhi.addEventListener("complete", e => {
      this.dispatchEvent(
        new SphericalControllerEvent(
          SphericalControllerEventType.MOVED_CAMERA_COMPLETE,
          TargetParam.PHI
        )
      );
    });
  }

  /**
   * 緯度のみをループで移動させる。
   * 縦方向にゆらゆらと回転させるための処理
   * @param {number} min　単位はラジアン角
   * @param {number} max　単位はラジアン角
   * @param option
   */
  public loopMovePhi(min: number, max: number, option?: EasingOption): void {
    option = EasingOption.init(option, this, true);

    const toMin = this.limitPhi(min);
    const toMax = this.limitPhi(max);
    const loop = () => {
      this.stopLoopMovePhi();
      this.tweenPhi = Tween.get(this.pos, { loop: -1 })
        .to({ phi: toMax }, option.duration, option.easing)
        .to({ phi: toMin }, option.duration, option.easing);
      this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    };

    this.stopLoopMovePhi();
    const firstDuration = this.getFirstDuration(
      option.duration,
      this.pos.phi,
      toMax,
      toMin
    );
    this.tweenPhi = Tween.get(this.pos)
      .to({ phi: toMin }, firstDuration, option.easing)
      .call(loop);
    this.tweenPhi.addEventListener("change", this.setNeedUpdate);
  }

  private getFirstDuration(
    duration: number,
    current: number,
    max: number,
    min: number
  ): number {
    return Math.abs(duration * ((current - min) / (max - min)));
  }

  public stopLoopMovePhi(): void {
    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
  }

  public loopMoveTheta(min: number, max: number, option?: EasingOption): void {
    option = EasingOption.init(option, this, true);

    const toMin = this.limitTheta(min);
    const toMax = this.limitTheta(max);
    const loop = () => {
      this.stopLoopMoveTheta();
      this.tweenTheta = Tween.get(this.pos, { loop: -1 })
        .to({ theta: toMax }, option.duration, option.easing)
        .to({ theta: toMin }, option.duration, option.easing);
      this.tweenTheta.addEventListener("change", this.setNeedUpdate);
    };

    this.stopLoopMoveTheta();
    const firstDuration = this.getFirstDuration(
      option.duration,
      this.pos.theta,
      toMax,
      toMin
    );
    this.tweenTheta = Tween.get(this.pos)
      .to({ theta: toMin }, firstDuration, option.easing)
      .call(loop);
    this.tweenTheta.addEventListener("change", this.setNeedUpdate);
  }

  public stopLoopMoveTheta(): void {
    this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
  }

  /**
   * カメラシフトを移動する
   * @param value 移動先
   * @param option
   */
  public moveCameraShift(value: Vector3, option?: EasingOption): void {
    option = EasingOption.init(option, this);

    this.tweenCameraShift = SphericalController.removeTween(
      this.tweenCameraShift
    );
    if (!this.cameraShift) {
      this.cameraShift = new Vector3();
    }

    this.tweenCameraShift = Tween.get(this.cameraShift).to(
      { x: value.x, y: value.y, z: value.z },
      option.duration,
      option.easing
    );
    this.tweenCameraShift.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * 半径を加算する。
   * ズームインアウトを行う際のメソッド
   * @param value
   * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
   */
  public addR(value: number, overrideTween: boolean = false): void {
    if (!overrideTween && this.isPlaying()) return;
    if (overrideTween && this.isPlaying()) {
      this.pauseTween();
    }

    this.pos.radius += value;
    this.setNeedUpdate(null);
  }

  /**
   * カメラターゲットの座標を加算する。
   * 水平、垂直移動などに使用
   * @param pos
   * @param overrideTween
   */
  public addTargetPosition(pos: Vector3, overrideTween: boolean = false): void {
    if (!overrideTween && this.isPlaying()) return;
    if (overrideTween && this.isPlaying()) {
      this.pauseTween();
    }

    this._cameraTarget.position.add(pos);
    this.setNeedUpdate(null);
  }

  /**
   * 経度を加算する。
   * 横方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
   */
  public addTheta(value: number, overrideTween: boolean = false): void {
    if (!overrideTween && this.isPlaying()) return;
    if (overrideTween && this.isPlaying()) {
      this.pauseTween();
    }

    this.pos.theta += value;
    this.pos.theta = this.limitTheta(this.pos.theta);

    this.setNeedUpdate(null);
  }

  /**
   * 緯度を加算する
   * 縦方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
   */
  public addPhi(value: number, overrideTween: boolean = false): void {
    if (!overrideTween && this.isPlaying()) return;
    if (overrideTween && this.isPlaying()) {
      this.pauseTween();
    }

    this.pos.phi += value;
    this.pos.phi = this.limitPhi(this.pos.phi);

    this.setNeedUpdate(null);
  }

  private limitPhi(phi: number): number {
    if (this.phiMax == null || this.phiMin == null) return phi;

    phi = Math.min(phi, this.phiMax);
    phi = Math.max(phi, this.phiMin);
    return phi;
  }

  private limitTheta(theta: number): number {
    if (this.thetaMin == null || this.thetaMax == null) return theta;

    theta = Math.min(theta, this.thetaMax);
    theta = Math.max(theta, this.thetaMin);
    return theta;
  }

  /**
   * 全てのtweenインスタンスを停止、破棄する
   */
  public pauseTween(): void {
    //全体同時移動用Tween
    this.tweenTarget = SphericalController.removeTween(this.tweenTarget);

    //特定プロパティ用Tween
    this.tweenR = SphericalController.removeTween(this.tweenR);
    this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    this.tweenCameraShift = SphericalController.removeTween(
      this.tweenCameraShift
    );
  }

  /**
   * 現在アクティブなTweenが存在するか確認する。
   */
  public isPlaying(): boolean {
    if (this.tweenR && !this.tweenR.paused) return true;
    if (this.tweenTheta && !this.tweenTheta.paused) return true;
    if (this.tweenPhi && !this.tweenPhi.paused) return true;
    if (this.tweenCameraShift && !this.tweenCameraShift.paused) return true;
    if (this.tweenTarget && !this.tweenTarget.paused) return true;
    return false;
  }

  /**
   * 指定されたtweenを停止する。
   * @param {createjs.Tween | null} tween
   * @return {null}
   */
  private static removeTween(tween: Tween | null): null {
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

/**
 * イージングオプション
 * move関数で一度限りのアニメーション設定するためのオプション。
 */
export class EasingOption {
  duration?: number;
  easing?: Function;
  normalize?: boolean; //回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。

  static init(
    option: EasingOption,
    controller: SphericalController,
    isLoop: boolean = false
  ): EasingOption {
    if (option == null) {
      option = new EasingOption();
    }
    if (option.duration == null) {
      option.duration = controller.duration;
    }
    if (option.easing == null) {
      option.easing = controller.easing;
      if (isLoop) {
        option.easing = controller.loopEasing;
      }
    }
    if (option.normalize === null || option.normalize === undefined) {
      option.normalize = true;
    }
    return option;
  }
}
