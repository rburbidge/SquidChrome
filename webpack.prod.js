const merge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(webpackCommon, {
  devtool: 'source-map',

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