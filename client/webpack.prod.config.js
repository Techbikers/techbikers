module.exports = require("./webpack.config")({
  production: true,
  separateStylesheet: true,
  minimize: true,
  cssModules: true
});
