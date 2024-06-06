const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageJson = require('./package.json');
const webpack = require('webpack');

module.exports = {
  entry: './src/KustoTrender.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false,
            }
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg/,
        type: 'asset/inline'
      },      
      {
        
        test: /\.(jp(e*)g|png|gif)$/,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'kustotrender.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
    })
  ]
};
