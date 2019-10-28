const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = merge(commonConfig, {
  context: path.resolve(__dirname, '../src'),
  entry: {
    app: './index.js'
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    library: "ans-chart",
    libraryTarget: "umd",
    filename: "ans-chart.min.js",
    umdNamedDefine: true
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  mode: 'production'
});
