'use strict';

var webpack = require('webpack');
var deepExtend = require('deep-extend');

var exclude = /node_modules|bower_components/;

var baseConfig = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/app'
  },

  context: __dirname + '/app',
  node: {
    __filename: true
  },

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    extensions: ['', '.js', '.styl']
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.jpg$/, loader: 'file-loader'},
      {test: /\.png$/, loader: 'url-loader?mimetype=image/png'},
      {test: /\.html$/, loader: 'raw', exclude: exclude},
      {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader', exclude: exclude},
      {test: /\.js$/, loader: 'jshint-loader', exclude: exclude}
    ]
  },
  eslint: {
    emitErrors: true
  }
};

var devConfig = {
  devtool: 'eval'
};

var prodConfig = {
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};

var watchConfig = deepExtend({}, devConfig, {
  watch: true
});

module.exports = deepExtend({}, baseConfig, devConfig);
