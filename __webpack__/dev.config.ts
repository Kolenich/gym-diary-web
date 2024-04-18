import CircularDependencyPlugin from 'circular-dependency-plugin';
import { type Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import commonConfig from './common.config';
import { commonPlugins, resolvePath } from './helpers';

export default merge(commonConfig, {
  mode: 'development',
  entry: resolvePath('src/index.ts'),
  output: {
    path: resolvePath('dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
    filename: '[name].js',
    publicPath: 'auto',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: false,
    liveReload: true,
    historyApiFallback: true,
    compress: true,
    static: {
      directory: resolvePath('dist/static'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8000',
        pathRewrite: { '^/api': '' },
      },
      {
        context: ['/wss'],
        target: 'ws://localhost:8000',
        ws: true,
      },
    ],
    open: true,
  },
  plugins: [
    ...commonPlugins,
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  ],
} as Configuration);
