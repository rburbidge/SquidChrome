const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackCommon, {
  devtool: 'none',

  // Should not need to set development for the prod build, but this error occurs: https://github.com/angular/angular/issues/23046
  // Uglification is still completed via a plugin
  mode: 'development',
  
  plugins: [
    new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
            output: {
                ascii_only: true,
            }
        }
    })
  ]
});