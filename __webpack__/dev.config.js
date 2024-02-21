const { merge } = require('webpack-merge');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const commonConfig = require('./common.config');
const { commonPlugins } = require('./helpers');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
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
    compress: true,
    static: {
      directory: path.join(__dirname, '..', 'dist', 'static'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8000',
        pathRewrite: { '^/api': '' },
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
});
