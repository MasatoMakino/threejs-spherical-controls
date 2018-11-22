import Tween = createjs.Tween;
import Ease = createjs.Ease;
import {
  Camera,
  Vector3,
  EventDispatcher,
  Mesh,
  MeshBasicMaterial,
  Spherical
} from "three";
import {
  SphericalControllerEvent,
  SphericalControllerEventType
} from "./SphericalControllerEvent";

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

  private isMoving: boolean = false;

  private static tweenDuration: number = 1333;
  private static tweenFunc = Ease.cubicOut;
  private static loopTweenFunc = Ease.sineInOut;

  private pos: Spherical = new Spherical();
  private static readonly EPS = 0.000001;
  public phiLimitMin: number = SphericalController.EPS;
  public phiLimitMax: number = Math.PI - SphericalController.EPS;

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
   * @param normalize
   *   回転数の正規化を行うか否か。
   *   trueの場合は目的の角度まで最短の経路で回転する。
   *   falseの場合は指定された回転数、回転する。
   */
  public move(pos: Spherical, normalize: boolean = true): void {
    this.pauseTween();
    this.isMoving = true;

    this.moveR(pos.radius);
    this.movePhi(pos.phi);
    this.moveTheta(pos.theta, normalize);
    if (this.tweenPhi) {
      this.tweenPhi.addEventListener("complete", this.onCompleteMove);
    }
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

  /**************
   * 特定パラメーターのみ移動
   **************/

  /**
   * 半径のみを移動する
   * @param value 単位はラジアン角
   */
  public moveR(value: number): void {
    this.tweenR = SphericalController.removeTween(this.tweenR);

    this.tweenR = Tween.get(this.pos).to(
      { radius: value },
      SphericalController.tweenDuration,
      SphericalController.tweenFunc
    );
    this.tweenR.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * カメラ半径のみをループで移動させる。
   * ゆらゆらとズームインアウトさせるための処理
   * @param {number} min
   * @param {number} max
   * @param {number} duration　往復の片道にかかる時間
   */
  public loopMoveR(min: number, max: number, duration: number): void {
    const stopTween = () => {
      this.tweenR = SphericalController.removeTween(this.tweenR);
    };

    const loop = () => {
      stopTween();
      this.tweenR = Tween.get(this.pos, { loop: -1 })
        .to({ radius: max }, duration, SphericalController.loopTweenFunc)
        .to({ radius: min }, duration, SphericalController.loopTweenFunc);
      this.tweenR.addEventListener("change", this.setNeedUpdate);
    };

    stopTween();
    const firstDuration = Math.abs(
      duration * ((this.pos.radius - min) / (max - min))
    );

    this.tweenR = Tween.get(this.pos)
      .to({ radius: min }, firstDuration, SphericalController.loopTweenFunc)
      .call(loop);
    this.tweenR.addEventListener("change", this.setNeedUpdate);
  }

  public stopLoopMoveR(): void {
    this.tweenR = SphericalController.removeTween(this.tweenR);
  }

  /**
   * カメラターゲットのみを移動する
   * @param value 単位はラジアン角
   */
  public moveTarget(value: Vector3): void {
    this.tweenTarget = SphericalController.removeTween(this.tweenTarget);

    this.tweenTarget = Tween.get(this._cameraTarget.position).to(
      { x: value.x, y: value.y, z: value.z },
      SphericalController.tweenDuration,
      SphericalController.tweenFunc
    );
    this.tweenTarget.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * 経度のみを移動する
   * 横向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param normalize 回転数の正規化を行うか否か。trueの場合は目的の角度まで最短の経路で回転する。falseの場合は指定された回転数、回転する。
   */
  public moveTheta(value: number, normalize: boolean = true): void {
    this.tweenTheta = SphericalController.removeTween(this.tweenTheta);

    let to = value;
    if (normalize) {
      to = SphericalController.getTweenTheta(this.pos.theta, value);
    }

    this.tweenTheta = Tween.get(this.pos).to(
      { theta: to },
      SphericalController.tweenDuration,
      SphericalController.tweenFunc
    );
    this.tweenTheta.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * 緯度のみを移動する
   * 縦方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   */
  public movePhi(value: number): void {
    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    const to = this.limitPhi(value);

    this.tweenPhi = Tween.get(this.pos).to(
      { phi: to },
      SphericalController.tweenDuration,
      SphericalController.tweenFunc
    );
    this.tweenPhi.addEventListener("change", this.setNeedUpdate);
  }

  /**
   * 緯度のみをループで移動させる。
   * 縦方向にゆらゆらと回転させるための処理
   * @param {number} min　単位はラジアン角
   * @param {number} max　単位はラジアン角
   * @param {number} duration　往復の片道にかかる時間
   */
  public loopMovePhi(min: number, max: number, duration: number): void {
    const stopTween = () => {
      this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    };

    const toMin = this.limitPhi(min);
    const toMax = this.limitPhi(max);

    const loop = () => {
      stopTween();
      this.tweenPhi = Tween.get(this.pos, { loop: -1 })
        .to({ phi: toMax }, duration, SphericalController.loopTweenFunc)
        .to({ phi: toMin }, duration, SphericalController.loopTweenFunc);
      this.tweenPhi.addEventListener("change", this.setNeedUpdate);
    };

    stopTween();
    const firstDuration = Math.abs(
      duration * ((this.pos.phi - toMin) / (toMax - toMin))
    );
    this.tweenPhi = Tween.get(this.pos)
      .to({ phi: toMin }, firstDuration, SphericalController.loopTweenFunc)
      .call(loop);
    this.tweenPhi.addEventListener("change", this.setNeedUpdate);
  }

  public stopLoopMovePhi(): void {
    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
  }

  /**
   * カメラシフトを移動する
   * @param value 移動先
   */
  public moveCameraShift(value: Vector3): void {
    this.tweenCameraShift = SphericalController.removeTween(
      this.tweenCameraShift
    );
    if (!this.cameraShift) {
      this.cameraShift = new Vector3();
    }

    this.tweenCameraShift = Tween.get(this.cameraShift).to(
      { x: value.x, y: value.y, z: value.z },
      SphericalController.tweenDuration,
      SphericalController.tweenFunc
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
    if (!overrideTween && this.isMoving) return;
    if (overrideTween && this.isMoving) {
      this.pauseTween();
    }

    this.pos.radius += value;
    this.setNeedUpdate(null);
  }

  /**
   * カメラターゲットの位置を移動する。
   * 水平、垂直移動などに使用
   * @param pos
   * @param overrideTween
   */
  public addTargetPosition(pos: Vector3, overrideTween: boolean = false): void {
    if (!overrideTween && this.isMoving) return;
    if (overrideTween && this.isMoving) {
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
    if (!overrideTween && this.isMoving) return;
    if (overrideTween && this.isMoving) {
      this.pauseTween();
    }

    this.pos.theta += value;
    this.pos.makeSafe();

    this.setNeedUpdate(null);
  }

  /**
   * 緯度を加算する
   * 縦方向回転を行う際のメソッド
   * @param value 単位はラジアン角
   * @param overrideTween tweenのキャンセルを行うか、defaultはfalse。trueの場合tweenを停止して現状値からの加算を行う
   */
  public addPhi(value: number, overrideTween: boolean = false): void {
    if (!overrideTween && this.isMoving) return;
    if (overrideTween && this.isMoving) {
      this.pauseTween();
    }

    this.pos.phi += value;
    this.pos.phi = this.limitPhi(this.pos.phi);

    this.setNeedUpdate(null);
  }

  private limitPhi(phi: number): number {
    if (this.phiLimitMax == null) return phi;

    phi = Math.min(phi, this.phiLimitMax);
    phi = Math.max(phi, this.phiLimitMin);
    return phi;
  }

  /**
   * 全てのtweenインスタンスを停止、破棄する
   */
  private pauseTween(): void {
    //全体同時移動用Tween
    this.tweenTarget = SphericalController.removeTween(this.tweenTarget);

    //特定プロパティ用Tween
    this.tweenR = SphericalController.removeTween(this.tweenR);
    this.tweenTheta = SphericalController.removeTween(this.tweenTheta);
    this.tweenPhi = SphericalController.removeTween(this.tweenPhi);
    this.tweenCameraShift = SphericalController.removeTween(
      this.tweenCameraShift
    );

    this.isMoving = false;
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
   * tweenのコンプリートイベントハンドラ
   * カメラ移動が終了したことを示すイベントを発行する。
   */
  private onCompleteMove = () => {
    this.isMoving = false;
    this.dispatchEvent(
      new SphericalControllerEvent(SphericalControllerEventType.MOVED_CAMERA)
    );
    this.dispatchEvent(
      new SphericalControllerEvent(
        SphericalControllerEventType.MOVED_CAMERA_COMPLETE
      )
    );
  };

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
    // console.log(fromDif);
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
