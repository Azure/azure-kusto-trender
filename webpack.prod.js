const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

/* Used to build UMD bundle, associated typings in dist/types, and minified css*/
module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-url')({
                    url: 'inline',
                    maxSize: 10,
                    fallback: 'copy',
                    assetsPath: 'dist/assets',
                  }),
                ],
              },
            },
          },
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({ generateStatsFile: true, analyzerMode: 'disabled', statsFilename: '../build_artifacts/umd_stats.json' }),
    new MiniCssExtractPlugin({
      filename: 'kustotrender.min.css'
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  output: {
    filename: 'kustotrender.min.js',
  },
});