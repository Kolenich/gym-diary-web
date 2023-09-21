const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const commonConfig = require('./common.config');
const { commonPlugins } = require('./helpers');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].js',
    assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      usedExports: true,
    },
    removeAvailableModules: true,
    sideEffects: true,
    concatenateModules: true,
    innerGraph: true,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          sourceMap: false,
          keep_fnames: true,
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          safari10: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    runtimeChunk: false,
  },
  plugins: commonPlugins,
});
