const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/* Used to run hot-reloading development server */
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: "pages/examples",
    },
    port: 3002,
    client: {
      overlay: {
        errors: true,
        warnings: false    // disable warning overlay so tests aren’t blocked
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "kustotrender.css",
    }),
  ],
});
