const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { folders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: folders.reduce(
      (aliases, folder) => ({
        ...aliases,
        [folder]: path.resolve(process.cwd(), `src/${folder}`),
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
};
