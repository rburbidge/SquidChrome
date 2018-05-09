var webpack = require('webpack');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'popup': './src/areas/popup/main.ts',
    'background': './src/areas/background/background.ts'
  },
  output: {
    filename: "[name].js",
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
            'ts-loader', 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
    //   {
    //     test: /\.css$/,
    //     exclude: helpers.root('src', 'app'),
    //     loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
    //   },
      {
        test: /\.css$/,
        // include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    // new webpack.ContextReplacementPlugin(
    //   // The (\\|\/) piece accounts for path separators in *nix and Windows
    //   /angular(\\|\/)core(\\|\/)@angular/,
    //   helpers.root('./src'), // location of your src
    //   {} // a map of your routes
    // ),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['app', 'vendor', 'polyfills']
    // }),

    // new HtmlWebpackPlugin({
    //   template: 'src/index.html'
    // })

    // new ExtractTextPlugin("styles.css"),
  ]
};