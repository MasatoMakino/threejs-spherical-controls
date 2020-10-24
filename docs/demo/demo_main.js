/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demoSrc/Common.js":
/*!***************************!*\
  !*** ./demoSrc/Common.js ***!
  \***************************/
/*! namespace exports */
/*! export Common [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Common\": () => /* binding */ Common\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nclass Common {\n  static initCamera(scene, W, H) {\n    const camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(45, W / H, 1, 400);\n    camera.position.set(0, 0, 100);\n    scene.add(camera);\n    return camera;\n  }\n\n  static initLight(scene) {\n    const ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight(0xffffff, 1.0);\n    scene.add(ambientLight);\n    return ambientLight;\n  }\n\n  static initHelper(scene, size = 30) {\n    const axesHelper = new three__WEBPACK_IMPORTED_MODULE_0__.AxesHelper(size);\n    scene.add(axesHelper);\n  }\n\n  static initCube(scene, size = 5) {\n    const geometry = new three__WEBPACK_IMPORTED_MODULE_0__.BoxGeometry(size, size, size);\n    const material = [new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0x00ff00\n    }), new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0xff0000\n    }), new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0x0000ff\n    }), new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0x00ff00\n    }), new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0xff0000\n    }), new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\n      color: 0x0000ff\n    })];\n    const cube = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(geometry, material);\n    scene.add(cube);\n    return cube;\n  }\n\n  static initRenderer(W, H, color = 0x000000, id = \"webgl-canvas\", antialias = true) {\n    const element = document.getElementById(id);\n    element.style.zIndex = 0;\n    element.style.position = \"absolute\";\n    const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({\n      canvas: element,\n      antialias: antialias\n    });\n    renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_0__.Color(color));\n    renderer.setSize(W, H);\n    renderer.setPixelRatio(window.devicePixelRatio);\n    return renderer;\n  }\n\n  static render(renderer, scene, camera) {\n    const rendering = () => {\n      renderer.render(scene, camera);\n      requestAnimationFrame(rendering);\n    };\n\n    rendering();\n  }\n\n}\n\n//# sourceURL=webpack://threejs-spherical-controls/./demoSrc/Common.js?");

/***/ }),

/***/ "./demoSrc/demo_main.js":
/*!******************************!*\
  !*** ./demoSrc/demo_main.js ***!
  \******************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dat_gui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dat.gui */ \"./node_modules/dat.gui/build/dat.gui.module.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tweenjs/tween.js */ \"./node_modules/@tweenjs/tween.js/dist/tween.esm.js\");\n/* harmony import */ var _Common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Common */ \"./demoSrc/Common.js\");\n/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib */ \"./lib/index.js\");\n/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst W = 1280;\nconst H = 800;\nlet renderer;\nlet scene;\nlet camera;\nconst R = 105;\n\nconst onDomContentsLoaded = () => {\n  // シーンを作成\n  scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\n  camera = _Common__WEBPACK_IMPORTED_MODULE_3__.Common.initCamera(scene, W, H);\n  renderer = _Common__WEBPACK_IMPORTED_MODULE_3__.Common.initRenderer(W, H);\n  _Common__WEBPACK_IMPORTED_MODULE_3__.Common.initLight(scene);\n  testPI2();\n  _Common__WEBPACK_IMPORTED_MODULE_3__.Common.initHelper(scene);\n  _Common__WEBPACK_IMPORTED_MODULE_3__.Common.initCube(scene);\n  const target = initTarget();\n  const controller = initController(target, R);\n  checkPlaying(controller);\n  _Common__WEBPACK_IMPORTED_MODULE_3__.Common.render(renderer, scene, camera);\n  initGUI(controller);\n};\n\nconst testPI2 = () => {\n  console.log(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(0) === 0);\n  console.log(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(Math.PI) === Math.PI);\n  console.log(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(-Math.PI) === -Math.PI);\n  console.log(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(Math.PI * 2));\n  console.log(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(Math.PI + 0.01) === -Math.PI + 0.01);\n  console.log(Math.abs(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerUtil.PI2ToPI(Math.PI * 200 + 0.01) - 0.01) < 0.000001);\n};\n\nconst initTarget = () => {\n  const geo = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(1);\n  const cameraTarget = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geo); // scene.add(cameraTarget);\n\n  return cameraTarget;\n};\n\nconst initController = (cameraTarget, R) => {\n  const cameraController = new _lib__WEBPACK_IMPORTED_MODULE_4__.SphericalController(camera, cameraTarget);\n  cameraController.initCameraPosition(new three__WEBPACK_IMPORTED_MODULE_1__.Spherical(R, 0.0001, Math.PI * 2 * 12));\n  cameraController.initCameraShift(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(20, 0, 0));\n  cameraController.duration = 1666;\n  cameraController.addEventListener(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalControllerEventType.MOVED_CAMERA_COMPLETE, e => {\n    console.log(\"Complete : \", e);\n  });\n  return cameraController;\n};\n\nconst checkPlaying = controller => {\n  setInterval(() => {\n    console.log(controller.tweens.isPlaying());\n  }, 100);\n};\n\nconst initGUI = controller => {\n  const gui = new dat_gui__WEBPACK_IMPORTED_MODULE_0__.GUI();\n  initRandomGUI(gui, controller);\n  initAddGUI(gui, controller);\n  initLoopGUI(gui, controller);\n};\n\nlet randomAnimationID;\n\nconst initRandomGUI = (gui, controller) => {\n  const prop = {\n    toggleRandomMove: () => {\n      if (randomAnimationID != null) {\n        stopRandomAnimation(controller);\n      } else {\n        startRandomAnimation(controller);\n      }\n    }\n  };\n  gui.add(prop, \"toggleRandomMove\");\n};\n\nconst stopRandomAnimation = controller => {\n  controller.tweens.stop();\n  clearInterval(randomAnimationID);\n  randomAnimationID = null;\n};\n\nconst startRandomAnimation = controller => {\n  const move = () => {\n    const to = new three__WEBPACK_IMPORTED_MODULE_1__.Spherical(R, // Math.random() * 70 + 35,\n    Math.random() * Math.PI, Math.random() * Math.PI * 6 - Math.PI * 3);\n    controller.move(to, {\n      duration: 1500,\n      easing: _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_2__.default.Easing.Cubic.Out\n    });\n    console.log(\"Start : \", to);\n  };\n\n  move();\n  randomAnimationID = setInterval(move, 2000);\n};\n\nconst initAddGUI = (gui, controller) => {\n  const folder = gui.addFolder(\"add method\");\n  folder.open();\n  const moveAngle = 0.1;\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.R, +5, folder, controller);\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.R, -5, folder, controller);\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.PHI, +moveAngle, folder, controller);\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.PHI, -moveAngle, folder, controller);\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.THETA, +moveAngle, folder, controller);\n  addPositionGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.THETA, -moveAngle, folder, controller);\n};\n\nconst addPositionGUI = (type, value, folder, controller) => {\n  const prop = {};\n  let valString = value.toString();\n  if (value > 0) valString = \"+\" + valString;\n  const functionName = type + valString;\n\n  prop[functionName] = () => {\n    controller.addPosition(type, value);\n  };\n\n  folder.add(prop, functionName);\n};\n\nconst initLoopGUI = (gui, controller) => {\n  const folder = gui.addFolder(\"loop method\");\n  folder.open();\n  addLoopGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.R, 30, 150, folder, controller);\n  addLoopGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.PHI, 0, Math.PI, folder, controller);\n  addLoopGUI(_lib__WEBPACK_IMPORTED_MODULE_4__.SphericalParamType.THETA, -Math.PI / 4, Math.PI / 4, folder, controller);\n};\n\nconst addLoopGUI = (type, min, max, folder, controller) => {\n  let flag = false;\n  const option = {\n    duration: 10 * 1000\n  };\n  const functionName = \"loop_\" + type;\n  const prop = {};\n\n  prop[functionName] = () => {\n    if (flag) {\n      controller.stopLoop(type);\n    } else {\n      controller.loop(type, min, max, option);\n    }\n\n    flag = !flag;\n  };\n\n  folder.add(prop, functionName);\n};\n/**\n * DOMContentLoaded以降に初期化処理を実行する\n */\n\n\nwindow.onload = onDomContentsLoaded;\n\n//# sourceURL=webpack://threejs-spherical-controls/./demoSrc/demo_main.js?");

/***/ }),

/***/ "./lib/CameraPositionLimiter.js":
/*!**************************************!*\
  !*** ./lib/CameraPositionLimiter.js ***!
  \**************************************/
/*! flagged exports */
/*! export CameraPositionLimiter [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.CameraPositionLimiter = void 0;\n\nvar TargetParam_1 = __webpack_require__(/*! ./TargetParam */ \"./lib/TargetParam.js\");\n\nvar CameraPositionLimiter =\n/** @class */\nfunction () {\n  function CameraPositionLimiter() {\n    this.phiMin = CameraPositionLimiter.EPS;\n    this.phiMax = Math.PI - CameraPositionLimiter.EPS;\n    this.thetaMin = null;\n    this.thetaMax = null;\n    this.rMax = Number.MAX_VALUE;\n    this.rMin = CameraPositionLimiter.EPS;\n  }\n\n  CameraPositionLimiter.prototype.setLimit = function (type, max, min) {\n    switch (type) {\n      case TargetParam_1.SphericalParamType.PHI:\n        this.phiMax = max;\n        this.phiMin = min;\n        break;\n\n      case TargetParam_1.SphericalParamType.THETA:\n        this.thetaMax = max;\n        this.thetaMin = min;\n        break;\n    }\n  };\n\n  CameraPositionLimiter.prototype.clampWithType = function (type, val) {\n    switch (type) {\n      case TargetParam_1.SphericalParamType.PHI:\n        return CameraPositionLimiter.clamp(val, this.phiMax, this.phiMin);\n\n      case TargetParam_1.SphericalParamType.THETA:\n        return CameraPositionLimiter.clamp(val, this.thetaMax, this.thetaMin);\n\n      case TargetParam_1.SphericalParamType.R:\n        return CameraPositionLimiter.clamp(val, this.rMax, this.rMin);\n    }\n\n    return val;\n  };\n\n  CameraPositionLimiter.prototype.clampPosition = function (type, pos) {\n    var val = pos[type];\n    return this.clampWithType(type, val);\n  };\n\n  CameraPositionLimiter.clamp = function (value, max, min) {\n    if (min == null || max == null) return value;\n    value = Math.min(value, max);\n    value = Math.max(value, min);\n    return value;\n  };\n\n  CameraPositionLimiter.EPS = 0.000001;\n  return CameraPositionLimiter;\n}();\n\nexports.CameraPositionLimiter = CameraPositionLimiter;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/CameraPositionLimiter.js?");

/***/ }),

/***/ "./lib/CameraPositionUpdater.js":
/*!**************************************!*\
  !*** ./lib/CameraPositionUpdater.js ***!
  \**************************************/
/*! flagged exports */
/*! export CameraPositionUpdater [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.CameraPositionUpdater = void 0;\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar SphericalControllerEvent_1 = __webpack_require__(/*! ./SphericalControllerEvent */ \"./lib/SphericalControllerEvent.js\");\n\nvar CameraUpdateEvent_1 = __webpack_require__(/*! ./CameraUpdateEvent */ \"./lib/CameraUpdateEvent.js\");\n\nvar raf_ticker_1 = __webpack_require__(/*! raf-ticker */ \"./node_modules/raf-ticker/esm/index.js\");\n\nvar CameraPositionUpdater =\n/** @class */\nfunction () {\n  function CameraPositionUpdater(parent, camera, target) {\n    var _this = this;\n\n    this.isUpdate = false;\n    /**\n     * tweenによる更新フラグ処理\n     * イベントハンドラーで処理できるように関数とする。\n     * @param e\n     */\n\n    this.setNeedUpdate = function (e) {\n      _this.isUpdate = true;\n      _this.updateEvent = e;\n    };\n    /**\n     * カメラ位置および注視点の更新処理\n     */\n\n\n    this.updatePosition = function () {\n      if (!_this.isUpdate) return;\n      _this.isUpdate = false;\n      var e = _this.updateEvent;\n      var cameraTargetPos = new three_1.Vector3();\n      var cameraPos = _this._camera.position;\n      cameraPos.setFromSpherical(e.position);\n      cameraPos.add(e.cameraTarget.getWorldPosition(cameraTargetPos));\n\n      _this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);\n\n      _this._camera.lookAt(e.cameraTarget.getWorldPosition(cameraTargetPos));\n\n      if (e.shift) {\n        var pos = _this._camera.position.clone();\n\n        var move = new three_1.Vector3(e.shift.x, e.shift.y, e.shift.z);\n        move.applyEuler(_this._camera.rotation.clone());\n        pos.add(move);\n\n        _this._camera.position.set(pos.x, pos.y, pos.z);\n      }\n\n      _this.dispatcher.dispatchEvent(new SphericalControllerEvent_1.SphericalControllerEvent(SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA));\n    };\n\n    this.dispatcher = parent;\n    this._camera = camera;\n    this.dispatcher.addEventListener(CameraUpdateEvent_1.CameraUpdateEventType.UPDATE, this.setNeedUpdate);\n    raf_ticker_1.RAFTicker.addEventListener(raf_ticker_1.RAFTickerEventType.onBeforeTick, function (e) {\n      _this.updatePosition();\n    });\n  }\n\n  return CameraPositionUpdater;\n}();\n\nexports.CameraPositionUpdater = CameraPositionUpdater;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/CameraPositionUpdater.js?");

/***/ }),

/***/ "./lib/CameraUpdateEvent.js":
/*!**********************************!*\
  !*** ./lib/CameraUpdateEvent.js ***!
  \**********************************/
/*! flagged exports */
/*! export CameraUpdateEvent [provided] [no usage info] [missing usage info prevents renaming] */
/*! export CameraUpdateEventType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.CameraUpdateEventType = exports.CameraUpdateEvent = void 0;\n\nvar CameraUpdateEvent =\n/** @class */\nfunction () {\n  function CameraUpdateEvent(type, cameraTarget, position, shift) {\n    this.type = type;\n    this.cameraTarget = cameraTarget;\n    this.position = position;\n    this.shift = shift;\n  }\n\n  return CameraUpdateEvent;\n}();\n\nexports.CameraUpdateEvent = CameraUpdateEvent;\nvar CameraUpdateEventType;\n\n(function (CameraUpdateEventType) {\n  CameraUpdateEventType[\"UPDATE\"] = \"CameraEvent_TYPE_UPDATE\"; //カメラが移動した\n})(CameraUpdateEventType = exports.CameraUpdateEventType || (exports.CameraUpdateEventType = {}));\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/CameraUpdateEvent.js?");

/***/ }),

/***/ "./lib/EasingOption.js":
/*!*****************************!*\
  !*** ./lib/EasingOption.js ***!
  \*****************************/
/*! flagged exports */
/*! export EasingOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.EasingOption = void 0;\n/**\n * イージングオプション\n * move関数で一度限りのアニメーション設定するためのオプション。\n */\n\nvar EasingOption =\n/** @class */\nfunction () {\n  function EasingOption() {}\n\n  EasingOption.init = function (option, controller, isLoop) {\n    if (isLoop === void 0) {\n      isLoop = false;\n    }\n\n    if (option == null) {\n      option = new EasingOption();\n    }\n\n    option.duration = this.supplement(option.duration, controller.tweens.duration);\n    var defaultEase = isLoop ? controller.tweens.loopEasing : controller.tweens.easing;\n    option.easing = this.supplement(option.easing, defaultEase);\n    option.normalize = this.supplement(option.normalize, true);\n    return option;\n  };\n\n  EasingOption.supplement = function (target, defaultValue) {\n    if (target == null) return defaultValue;\n    return target;\n  };\n\n  return EasingOption;\n}();\n\nexports.EasingOption = EasingOption;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/EasingOption.js?");

/***/ }),

/***/ "./lib/SphericalController.js":
/*!************************************!*\
  !*** ./lib/SphericalController.js ***!
  \************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 3:16-20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.SphericalController = void 0;\n\nvar tween_js_1 = __webpack_require__(/*! @tweenjs/tween.js */ \"./node_modules/@tweenjs/tween.js/dist/tween.esm.js\");\n\nvar tween_js_ticker_1 = __webpack_require__(/*! tween.js-ticker */ \"./node_modules/tween.js-ticker/esm/index.js\");\n\nvar three_1 = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar SphericalControllerEvent_1 = __webpack_require__(/*! ./SphericalControllerEvent */ \"./lib/SphericalControllerEvent.js\");\n\nvar TargetParam_1 = __webpack_require__(/*! ./TargetParam */ \"./lib/TargetParam.js\");\n\nvar EasingOption_1 = __webpack_require__(/*! ./EasingOption */ \"./lib/EasingOption.js\");\n\nvar SphericalControllerUtil_1 = __webpack_require__(/*! ./SphericalControllerUtil */ \"./lib/SphericalControllerUtil.js\");\n\nvar CameraPositionLimiter_1 = __webpack_require__(/*! ./CameraPositionLimiter */ \"./lib/CameraPositionLimiter.js\");\n\nvar SphericalControllerTween_1 = __webpack_require__(/*! ./SphericalControllerTween */ \"./lib/SphericalControllerTween.js\");\n\nvar CameraPositionUpdater_1 = __webpack_require__(/*! ./CameraPositionUpdater */ \"./lib/CameraPositionUpdater.js\");\n\nvar CameraUpdateEvent_1 = __webpack_require__(/*! ./CameraUpdateEvent */ \"./lib/CameraUpdateEvent.js\");\n/**\n * 球面座標系でカメラ位置をコントロールするクラス。\n *\n * カメラ位置はThetaおよびPhiで決定される。\n * 0, 0の場合北極上にカメラが位置する。\n * Phi : 0 ~ Math.PI (縦回転)\n * Theta : -Math.PI ~ Math.PI (横回転)\n * の範囲で可動する。\n *\n * 北極南極を通過すると緯度も反転するため、このクラスでは南北90度以上の移動には対応していない。また、極点上空では座標が一意の値にならないため、Phi 0もしくはPIには対応していない。\n */\n\n\nvar SphericalController =\n/** @class */\nfunction (_super) {\n  __extends(SphericalController, _super);\n  /**\n   * コンストラクタ\n   * @param camera\n   * @param target\n   */\n\n\n  function SphericalController(camera, target) {\n    var _this = _super.call(this) || this;\n\n    _this.pos = new three_1.Spherical();\n    /**\n     * 画面のシフト\n     * 例えば(0,0,0)を指定すると_cameraTargetが必ず画面中央に表示される。\n     * 値を指定するとそのぶん_cameraTargetが中央からオフセットされる。\n     */\n\n    _this.cameraShift = new three_1.Vector3();\n    _this.tweens = new SphericalControllerTween_1.SphericalControllerTween();\n    _this.limiter = new CameraPositionLimiter_1.CameraPositionLimiter();\n\n    _this.dispatchUpdateEvent = function () {\n      var e = new CameraUpdateEvent_1.CameraUpdateEvent(CameraUpdateEvent_1.CameraUpdateEventType.UPDATE, _this._cameraTarget, _this.pos, _this.cameraShift);\n\n      _this.dispatchEvent(e);\n    };\n\n    _this._cameraTarget = target;\n    _this.cameraUpdater = new CameraPositionUpdater_1.CameraPositionUpdater(_this, camera, _this._cameraTarget);\n    tween_js_ticker_1.TWEENTicker.start();\n    return _this;\n  }\n  /**\n   * カメラ位置の初期設定を行う\n   * @param pos\n   * @param targetPos\n   */\n\n\n  SphericalController.prototype.initCameraPosition = function (pos, targetPos) {\n    this.pos = pos;\n    var lmt = this.limiter;\n    this.pos.phi = lmt.clampPosition(TargetParam_1.SphericalParamType.PHI, this.pos);\n    this.pos.theta = lmt.clampPosition(TargetParam_1.SphericalParamType.THETA, this.pos);\n    this.pos.radius = lmt.clampPosition(TargetParam_1.SphericalParamType.R, this.pos);\n\n    if (targetPos) {\n      this._cameraTarget.position.set(targetPos.x, targetPos.y, targetPos.z);\n    }\n\n    this.dispatchUpdateEvent();\n  };\n  /**\n   * カメラの位置ずれ設定を行う。\n   * @param {Vector3} shift\n   */\n\n\n  SphericalController.prototype.initCameraShift = function (shift) {\n    this.cameraShift = shift.clone();\n    this.dispatchUpdateEvent();\n  };\n  /**\n   * カメラを任意の位置に移動する\n   * @param pos\n   * @param option\n   */\n\n\n  SphericalController.prototype.move = function (pos, option) {\n    option = EasingOption_1.EasingOption.init(option, this);\n    this.tweens.stop();\n    this.movePosition(TargetParam_1.SphericalParamType.R, pos.radius, option);\n    this.movePosition(TargetParam_1.SphericalParamType.PHI, pos.phi, option);\n    this.movePosition(TargetParam_1.SphericalParamType.THETA, pos.theta, option);\n  };\n  /**\n   * カメラターゲットの変更\n   * TODO 現状未実装。カメラターゲットが変更になった際の移動方法を調査、実装。\n   * @param _target\n   */\n\n\n  SphericalController.prototype.changeTarget = function (_target) {\n    this._cameraTarget = _target; // ここでダミーのカメラターゲットをシーン直下に生成\n    // 両ターゲット間をtweenさせる。\n    // 座標はworld座標に変換して統一。\n    // tweenが終了したらthis._cameraTargetを差し替え。\n  };\n  /**\n   * カメラ座標のうち、typeで指定された１つのパラメーターを移動する\n   * @param type\n   * @param value\n   * @param option\n   */\n\n\n  SphericalController.prototype.movePosition = function (type, value, option) {\n    option = EasingOption_1.EasingOption.init(option, this);\n\n    if (type === TargetParam_1.SphericalParamType.THETA && option.normalize) {\n      value = SphericalControllerUtil_1.SphericalControllerUtil.getTweenTheta(this.pos.theta, value);\n    }\n\n    var to = this.limiter.clampWithType(type, value);\n    this.tweens.overrideTween(type, this.getTweenPosition(type, to, option));\n  };\n  /**\n   * movePosition関数用のtweenオブジェクトを生成する。\n   * @param targetParam\n   * @param to\n   * @param option\n   */\n\n\n  SphericalController.prototype.getTweenPosition = function (targetParam, to, option) {\n    var _this = this;\n\n    var toObj = {};\n    toObj[targetParam] = to;\n    return new tween_js_1.Tween(this.pos).to(toObj, option.duration).easing(option.easing).onUpdate(this.dispatchUpdateEvent).onComplete(function () {\n      _this.onCompleteCameraTween(targetParam);\n    }).start();\n  };\n  /**\n   * Tweenのcompleteイベントで呼び出される関数。\n   * MOVED_CAMERA_COMPLETEイベントを発行する。\n   * @param paramType\n   */\n\n\n  SphericalController.prototype.onCompleteCameraTween = function (paramType) {\n    this.dispatchEvent(new SphericalControllerEvent_1.SphericalControllerEvent(SphericalControllerEvent_1.SphericalControllerEventType.MOVED_CAMERA_COMPLETE, paramType));\n  };\n  /**\n   * カメラターゲットのみを移動する\n   * @param value 単位はラジアン角\n   * @param option\n   */\n\n\n  SphericalController.prototype.moveTarget = function (value, option) {\n    option = EasingOption_1.EasingOption.init(option, this);\n    var tween = new tween_js_1.Tween(this._cameraTarget.position).to({\n      x: value.x,\n      y: value.y,\n      z: value.z\n    }, option.duration).easing(option.easing).onUpdate(this.dispatchUpdateEvent).start();\n    this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_TARGET, tween);\n  };\n\n  SphericalController.prototype.stopLoop = function (type) {\n    this.tweens.stopTween(type);\n  };\n  /**\n   * カメラ位置をループで移動させる。\n   * ゆらゆらと動かすための処理。\n   * @param type どのプロパティを操作するか。\n   * @param min\n   * @param max\n   * @param option このアニメーションに対する1回限りの設定を行う。\n   */\n\n\n  SphericalController.prototype.loop = function (type, min, max, option) {\n    var _this = this;\n\n    if (type === TargetParam_1.SphericalParamType.THETA) {\n      this.pos.theta = SphericalControllerUtil_1.SphericalControllerUtil.PI2ToPI(this.pos.theta);\n    }\n\n    option = EasingOption_1.EasingOption.init(option, this, true);\n    var toMin = this.limiter.clampWithType(type, min);\n    var toMax = this.limiter.clampWithType(type, max);\n    var toObjMax = {};\n    toObjMax[type] = toMax;\n    var toObjMin = {};\n    toObjMin[type] = toMin;\n\n    var loop = function () {\n      var tween = new tween_js_1.Tween(_this.pos).to(toObjMax, option.duration).yoyo(true).easing(option.easing).onUpdate(_this.dispatchUpdateEvent).repeat(Infinity).start();\n\n      _this.tweens.overrideTween(type, tween);\n    };\n\n    var firstDuration = SphericalControllerUtil_1.SphericalControllerUtil.getFirstDuration(option.duration, this.pos[type], toMax, toMin);\n    var tween = new tween_js_1.Tween(this.pos).easing(option.easing).to(toObjMin, firstDuration).onUpdate(this.dispatchUpdateEvent).onComplete(loop).start();\n    this.tweens.overrideTween(type, tween);\n  };\n  /**\n   * カメラシフトを移動する\n   * @param value 移動先\n   * @param option\n   */\n\n\n  SphericalController.prototype.moveCameraShift = function (value, option) {\n    option = EasingOption_1.EasingOption.init(option, this);\n    var tween = new tween_js_1.Tween(this.cameraShift).easing(option.easing).to({\n      x: value.x,\n      y: value.y,\n      z: value.z\n    }, option.duration).onUpdate(this.dispatchUpdateEvent).start();\n    this.tweens.overrideTween(TargetParam_1.TargetParam.CAMERA_SHIFT, tween);\n  };\n  /**\n   * カメラターゲットの座標を加算する。\n   * 水平、垂直移動などに使用\n   * @param pos\n   * @param overrideTween\n   */\n\n\n  SphericalController.prototype.addTargetPosition = function (pos, overrideTween) {\n    if (overrideTween === void 0) {\n      overrideTween = false;\n    }\n\n    if (!overrideTween && this.tweens.isPlaying()) return;\n\n    if (overrideTween && this.tweens.isPlaying()) {\n      this.tweens.stop();\n    }\n\n    this._cameraTarget.position.add(pos);\n\n    this.dispatchUpdateEvent();\n  };\n  /**\n   * カメラのSpherical座標に加算する。\n   * @param type\n   * @param value\n   * @param overrideTween\n   */\n\n\n  SphericalController.prototype.addPosition = function (type, value, overrideTween) {\n    if (overrideTween === void 0) {\n      overrideTween = false;\n    }\n\n    if (!overrideTween && this.tweens.isPlaying()) return;\n\n    if (overrideTween && this.tweens.isPlaying()) {\n      this.tweens.stop();\n    }\n\n    this.pos[type] += value;\n    this.pos[type] = this.limiter.clampPosition(type, this.pos);\n    this.dispatchUpdateEvent();\n  };\n\n  return SphericalController;\n}(three_1.EventDispatcher);\n\nexports.SphericalController = SphericalController;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/SphericalController.js?");

/***/ }),

/***/ "./lib/SphericalControllerEvent.js":
/*!*****************************************!*\
  !*** ./lib/SphericalControllerEvent.js ***!
  \*****************************************/
/*! flagged exports */
/*! export SphericalControllerEvent [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SphericalControllerEventType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.SphericalControllerEventType = exports.SphericalControllerEvent = void 0;\n\nvar SphericalControllerEvent =\n/** @class */\nfunction () {\n  function SphericalControllerEvent(type, targetParam) {\n    this.type = type;\n    this.targetParam = targetParam;\n  }\n\n  return SphericalControllerEvent;\n}();\n\nexports.SphericalControllerEvent = SphericalControllerEvent;\nvar SphericalControllerEventType;\n\n(function (SphericalControllerEventType) {\n  SphericalControllerEventType[\"MOVED_CAMERA\"] = \"CameraEvent_TYPE_MOVED_CAMERA\";\n  SphericalControllerEventType[\"MOVED_CAMERA_COMPLETE\"] = \"CameraEvent_TYPE_MOVED_CAMERA_COMPLETE\"; //カメラ移動アニメーションが完了した\n})(SphericalControllerEventType = exports.SphericalControllerEventType || (exports.SphericalControllerEventType = {}));\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/SphericalControllerEvent.js?");

/***/ }),

/***/ "./lib/SphericalControllerTween.js":
/*!*****************************************!*\
  !*** ./lib/SphericalControllerTween.js ***!
  \*****************************************/
/*! flagged exports */
/*! export SphericalControllerTween [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.SphericalControllerTween = void 0;\n\nvar tween_js_1 = __webpack_require__(/*! @tweenjs/tween.js */ \"./node_modules/@tweenjs/tween.js/dist/tween.esm.js\");\n/**\n * [[SphericalController]]で使用するTweenインスタンスを管理するためのクラス。\n * Tweenを格納するMapと、新規Tweenに適用されるデフォルト設定で構成される。\n */\n\n\nvar SphericalControllerTween =\n/** @class */\nfunction () {\n  function SphericalControllerTween() {\n    this.tweenMap = new Map();\n    this.duration = 1333;\n    this.easing = tween_js_1.Easing.Cubic.Out;\n    this.loopEasing = tween_js_1.Easing.Sinusoidal.InOut;\n  }\n  /**\n   * 指定されたTweenを停止する。\n   * @param type\n   */\n\n\n  SphericalControllerTween.prototype.stopTween = function (type) {\n    var tween = this.tweenMap.get(type);\n    if (!tween) return;\n    tween.stop();\n    this.tweenMap.delete(type);\n  };\n  /**\n   * 指定されたTweenを停止し、受け取ったTweenで上書きする。\n   * @param type\n   * @param tween\n   */\n\n\n  SphericalControllerTween.prototype.overrideTween = function (type, tween) {\n    this.stopTween(type);\n\n    if (tween) {\n      this.tweenMap.set(type, tween);\n    }\n  };\n  /**\n   * 現在アクティブなTweenが存在するか確認する。\n   */\n\n\n  SphericalControllerTween.prototype.isPlaying = function () {\n    var isPlaying = false;\n    this.tweenMap.forEach(function (value, key) {\n      if (value && value.isPlaying()) isPlaying = true;\n    });\n    return isPlaying;\n  };\n  /**\n   * 全てのtweenインスタンスを停止する。\n   */\n\n\n  SphericalControllerTween.prototype.stop = function () {\n    var _this = this;\n\n    this.tweenMap.forEach(function (value, key) {\n      if (key) _this.stopTween(key);\n    });\n  };\n\n  return SphericalControllerTween;\n}();\n\nexports.SphericalControllerTween = SphericalControllerTween;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/SphericalControllerTween.js?");

/***/ }),

/***/ "./lib/SphericalControllerUtil.js":
/*!****************************************!*\
  !*** ./lib/SphericalControllerUtil.js ***!
  \****************************************/
/*! flagged exports */
/*! export SphericalControllerUtil [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.SphericalControllerUtil = void 0;\n\nvar SphericalControllerUtil =\n/** @class */\nfunction () {\n  function SphericalControllerUtil() {}\n  /**\n   * 任意の点までの回転アニメーションに必要になる\n   * 回転方向を算出する処理。\n   *\n   * @param from\n   * @param to\n   * @returns {number}    最短距離での目標となる回転角\n   */\n\n\n  SphericalControllerUtil.getTweenTheta = function (from, to) {\n    to = this.PI2ToPI(to);\n    var fromDif = this.PI2ToPI(from);\n    fromDif = this.PI2ToPI(to - fromDif);\n    return from + fromDif;\n  };\n  /**\n   * ラジアンを-Math.PI ~ Math.PIの範囲に正規化する。\n   * Math.PIもしくは-Math.PIを入力すると正負が反転する。\n   * @param {number} value\n   * @return {number}\n   * @constructor\n   */\n\n\n  SphericalControllerUtil.PI2ToPI = function (value) {\n    return Math.atan2(Math.sin(value), Math.cos(value));\n  };\n  /**\n   * loopアニメーションの初回振幅のdurationを算出する\n   * @param duration\n   * @param current\n   * @param max\n   * @param min\n   */\n\n\n  SphericalControllerUtil.getFirstDuration = function (duration, current, max, min) {\n    return Math.abs(duration * ((current - min) / (max - min)));\n  };\n\n  return SphericalControllerUtil;\n}();\n\nexports.SphericalControllerUtil = SphericalControllerUtil;\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/SphericalControllerUtil.js?");

/***/ }),

/***/ "./lib/TargetParam.js":
/*!****************************!*\
  !*** ./lib/TargetParam.js ***!
  \****************************/
/*! flagged exports */
/*! export SphericalParamType [provided] [no usage info] [missing usage info prevents renaming] */
/*! export TargetParam [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.SphericalParamType = exports.TargetParam = void 0;\n/**\n * [[SphericalController]]が管理する、どのオブジェクトを操作するかを指定する定数。\n *\n * ```typescript\n * controller.tweens.stopTween(TargetParam.CAMERA_TARGET);\n * // -> カメラターゲットメッシュの移動を停止する。\n * ```\n *\n * [[SphericalParamType]]定数と合わせて、どの対象を操作するかを指定する。\n */\n\nvar TargetParam;\n\n(function (TargetParam) {\n  TargetParam[\"CAMERA_TARGET\"] = \"cameraTarget\";\n  TargetParam[\"CAMERA_SHIFT\"] = \"cameraShift\";\n})(TargetParam = exports.TargetParam || (exports.TargetParam = {}));\n/**\n * Spherical型の座標のうち、どのパラメーターを操作するかを指定する定数。\n * 定数はTHREE.Spherical.*のいずれかのメンバーに対応する。\n *\n * ```typescript\n * controller.addPosition(SphericalParamType.R, 1.0);\n * // -> 半径に1.0加算される。\n * ```\n *\n * [[TargetParam]]定数と合わせて、どの対象を操作するかを指定する。\n */\n\n\nvar SphericalParamType;\n\n(function (SphericalParamType) {\n  SphericalParamType[\"R\"] = \"radius\";\n  SphericalParamType[\"PHI\"] = \"phi\";\n  SphericalParamType[\"THETA\"] = \"theta\";\n})(SphericalParamType = exports.SphericalParamType || (exports.SphericalParamType = {}));\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/TargetParam.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: top-level-this-exports, __webpack_exports__, __webpack_require__ */
/*! CommonJS bailout: this is used directly at 3:22-26 */
/*! CommonJS bailout: this is used directly at 16:19-23 */
/*! CommonJS bailout: exports is used directly at 24:47-54 */
/*! CommonJS bailout: exports is used directly at 26:51-58 */
/*! CommonJS bailout: exports is used directly at 28:52-59 */
/*! CommonJS bailout: exports is used directly at 30:40-47 */
/*! CommonJS bailout: exports is used directly at 32:39-46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\n\nvar __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  Object.defineProperty(o, k2, {\n    enumerable: true,\n    get: function () {\n      return m[k];\n    }\n  });\n} : function (o, m, k, k2) {\n  if (k2 === undefined) k2 = k;\n  o[k2] = m[k];\n});\n\nvar __exportStar = this && this.__exportStar || function (m, exports) {\n  for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\n__exportStar(__webpack_require__(/*! ./SphericalController */ \"./lib/SphericalController.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./SphericalControllerUtil */ \"./lib/SphericalControllerUtil.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./SphericalControllerEvent */ \"./lib/SphericalControllerEvent.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./EasingOption */ \"./lib/EasingOption.js\"), exports);\n\n__exportStar(__webpack_require__(/*! ./TargetParam */ \"./lib/TargetParam.js\"), exports);\n\n//# sourceURL=webpack://threejs-spherical-controls/./lib/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"demo_main": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./demoSrc/demo_main.js","vendor"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkthreejs_spherical_controls"] = self["webpackChunkthreejs_spherical_controls"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;