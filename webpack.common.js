const path = require('path');
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
          'style-loader',
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
      {
        test: /\.(png|jpe?g)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ],
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
    }),
  ]
};