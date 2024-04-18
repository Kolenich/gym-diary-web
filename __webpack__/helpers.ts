import { resolve } from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { container } from 'webpack';

const { ModuleFederationPlugin } = container;

import { dependencies as deps } from '../package.json';

const CONTENT_HASH = '.[contenthash:8]';

export const resolvePath = (path: string): string => resolve(process.cwd(), path);

export const folders = ['api', 'components', 'constants', 'hooks', 'pages', 'routers', 'store', 'utils'];

export const commonPlugins = [
  new MiniCssExtractPlugin({
    filename: `static/css/[name]${CONTENT_HASH}.css`,
    chunkFilename: `static/css/[name]${CONTENT_HASH}.css`,
  }),
  new ModuleFederationPlugin({
    name: 'gym_diary',
    filename: 'remoteEntry.js',
    exposes: {
      './WorkoutsSchedule': resolvePath('src/pages/WeeksSchedule/WeeksSchedule'),
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
    template: resolvePath('public/index.html'),
    favicon: resolvePath('public/favicon.ico'),
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
];
