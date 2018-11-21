const path = require("path");
const bs = require("browser-sync").create();

const distDir = path.resolve(process.cwd(), "docs", "demo");

let isProduction = true;
if (process.argv.length >= 3) {
  isProduction = process.argv[2] !== "development";
}
console.log(process.argv[2]);
console.log(isProduction);

bs.init({
  server: distDir,
  watch: !isProduction
});
