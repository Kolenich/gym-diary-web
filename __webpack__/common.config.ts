import { loader as miniCssLoader } from 'mini-css-extract-plugin';
import { type Configuration } from 'webpack';

import { folders, resolvePath } from './helpers';

const commonConfig: Configuration = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: folders.reduce(
      (aliases, folder) => ({
        ...aliases,
        [folder]: resolvePath(`src/${folder}`),
      }),
      {},
    ),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.(svg|webp|jpg|jpeg|png|gif|mp3)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[hash][ext][query]',
        },
      },
      {
        test: /\.css$/,
        use: [miniCssLoader, 'css-loader'],
      },
    ],
  },
};

export default commonConfig;
