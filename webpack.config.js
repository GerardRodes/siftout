var path = require('path')
var HTMLWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  name: 'build',
  entry: './app/src/Siftout.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: __dirname + '/build',
    library: 'Siftout',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve : {
    extensions: ['','.js'],
    root: path.resolve(__dirname) + '/app/src'
  },
  plugins: [HTMLWebpackPluginConfig]
}