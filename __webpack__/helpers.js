const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { dependencies: deps } = require('../package.json');

const CONTENT_HASH = '.[contenthash:8]';

module.exports = {
  folders: ['api', 'components', 'constants', 'hooks', 'pages', 'routers', 'store', 'utils'],
  commonPlugins: [
    new MiniCssExtractPlugin({
      filename: `static/css/[name]${CONTENT_HASH}.css`,
      chunkFilename: `static/css/[name]${CONTENT_HASH}.css`,
    }),
    new ModuleFederationPlugin({
      name: 'gym_diary',
      filename: 'remoteEntry.js',
      exposes: {
        './WorkoutsSchedule': path.resolve(process.cwd(), 'src/pages/WeeksSchedule/WeeksSchedule'),
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(process.cwd(), 'public/index.html'),
      favicon: path.resolve(process.cwd(), 'public/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
};
