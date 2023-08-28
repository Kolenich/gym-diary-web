const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'api': path.resolve(__dirname, './src/api'),
      'components': path.resolve(__dirname, './src/components'),
      'constants': path.resolve(__dirname, './src/constants'),
      'pages': path.resolve(__dirname, './src/pages'),
      'routers': path.resolve(__dirname, './src/routers'),
      'store': path.resolve(__dirname, './src/store'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
};
