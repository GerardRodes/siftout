const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'min',
  entry: './app/src/Siftout.js',
  output: {
    filename: 'siftout.min.js',
    path: './build',
    library: 'Siftout',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    root: [path.resolve('./app/src')],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        drop_console: true,
        warnings: false
      },
      mangle: { except: ['Siftout'] }
    })
  ],
};