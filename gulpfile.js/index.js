"use strict";

const { series } = require("gulp");

const doc = require("gulptask-tsdoc").get();
const server = require("gulptask-dev-server").get("./docs/demo");
const { bundleDemo, watchDemo } = require("gulptask-demo-page").get({
  externalScripts: [
    "//cdnjs.cloudflare.com/ajax/libs/tweenjs/1.0.2/tweenjs.min.js"
  ],
  body: `<canvas id="webgl-canvas" width="1920" height="1080"></canvas>`
});
const { tsc, watchTsc } = require("gulptask-tsc").get();

const watchTasks = async () => {
  watchDemo();
  watchTsc();
};

exports.start_dev = series(watchTasks, server);
exports.build = series(tsc, bundleDemo, doc);
