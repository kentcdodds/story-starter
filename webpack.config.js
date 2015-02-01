var webpack = require('webpack');
var _ = require('lodash');
var path = require('path');

var exclude = /node_modules/;

module.exports = getConfig();

module.exports.getConfig = getConfig;

function getConfig(context) {
  /* jshint maxcomplexity:7 */
  context = context || 'dev';
  var dev = context === 'dev';
  var test = context === 'test';
  var prod = context === 'prod';

  var plugins = {
    commonPre: [
      new webpack.DefinePlugin({
        ON_DEV: dev,
        ON_PROD: prod,
        ON_TEST: test
      }),
      new webpack.NormalModuleReplacementPlugin(/^ngCommon$/, function(r) {
        if (/ngCommon$/.test(r.context)) {
          // when resolving `ngCommon` from `ngCommon`
          // start resolving one level up instead...
          r.context = path.resolve(r.context, '../../../');
        }
      })
    ],
    dev: [],
    prod: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ],
    commonPost: [
      new webpack.BannerPlugin(getBanner(), {raw: true})
    ]
  };
  plugins.test = plugins.prod;

  var config = {
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      path: here(prod ? '/dist' : '/app'),
      pathinfo: dev
    },

    context: here('app'),
    node: {
      __filename: true
    },

    stats: {
      colors: true,
      reasons: true
    },

    devtool: prod ? 'source-map' : 'eval',

    plugins: _.filter(_.union(
      plugins.commonPre, plugins[context], plugins.commonPost
    )),

    resolve: {
      extensions: ['', '.js'],
      modulesDirectories: ['shared', 'node_modules'],
      alias: {
        ssCommonModule: here('app/components/shared/ngCommon'),
        stateUtils: here('app/shared/ngCommon/services/stateUtils'),
        utils: here('app/shared/ngCommon/services/utils')
      },
      root: here('app')
    },

    resolveLoader: {
      modulesDirectories: ['webpack/loaders', 'node_modules'],
      root: here()
    },

    externals: {},

    module: {
      loaders: [
        {test: /\.css$/, loader: 'style!css'},
        {test: /\.jpg$/, loader: 'file?name=/res/[name].[ext]?[hash]'},
        {test: /\.png$/, loader: 'url?mimetype=image/png'},
        {test: /\.html$/, loader: 'raw', exclude: exclude},
        {test: /\.styl$/, loader: 'style!css!stylus', exclude: exclude},
        {test: /\.js$/, loader: (dev ? '' : 'ng-annotate!') + '6to5!jshint', exclude: exclude},
        {
          test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=/res/[name].[ext]?[hash]'
        }
      ]
    }
  };

  console.log('Webpack config is in ' + context + ' mode');
  return config;
}

function getBanner() {
  return '// Story Starter built with ♥ by  (ó ì_í)=óò=(ì_í ò)\n';
}


function here(p) {
  return path.join(__dirname, p || '');
}
