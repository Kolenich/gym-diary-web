import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';

import commonConfig from './common.config';
import { commonPlugins, resolvePath } from './helpers';

export default merge(commonConfig, {
  mode: 'production',
  performance: {
    hints: false,
  },
  output: {
    publicPath: 'auto',
    path: resolvePath('build'),
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
            ecma: 2020,
          },
          compress: {
            ecma: 5,
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
