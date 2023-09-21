const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { dependencies: deps } = require('../package.json');

module.exports = {
  folders: ['api', 'components', 'constants', 'hooks', 'pages', 'routers', 'store', 'utils'],
  commonPlugins: [
    new ModuleFederationPlugin({
      name: 'gym_diary',
      library: { type: 'var', name: 'gym_diary' },
      exposes: {
        './WorkoutsSchedule': path.resolve(__dirname, '..', 'src', 'App'),
      },
      filename: 'remoteEntry.js',
      shared: {
        react: { singleton: true, requiredVersion: deps.react, eager: true },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'], eager: true },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'], eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
      favicon: path.resolve(__dirname, '..', 'public', 'favicon.ico'),
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
