const { merge } = require('webpack-merge');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const commonConfig = require('./common.config');
const { commonPlugins } = require('./helpers');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
    filename: '[name].js',
    publicPath: 'auto',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '..', 'build', 'static'),
    },
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
});
