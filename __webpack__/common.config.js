const path = require('path');

const { folders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: folders.reduce(
      (aliases, folder) => ({
        ...aliases,
        [folder]: path.resolve(__dirname, '..', 'src', folder),
      }),
      {},
    ),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: 'file-loader',
      },
      {
        test: /\.css$/,
        use: 'css-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
};
