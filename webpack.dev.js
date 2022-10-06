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
    // host: "insights-local.timeseries.azure.com",
    // https: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "kustoTrender.css",
    }),
  ],
});
