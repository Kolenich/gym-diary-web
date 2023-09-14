const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json');

module.exports = {
  webpack: {
    alias: {
      api: path.resolve(__dirname, './src/api'),
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      hooks: path.resolve(__dirname, './src/hooks'),
      pages: path.resolve(__dirname, './src/pages'),
      routers: path.resolve(__dirname, './src/routers'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
    },
    plugins: [
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        include: /src/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
      new ModuleFederationPlugin({
        name: 'gym_diary',
        filename: 'remoteEntry.js',
        library: { type: 'var', name: 'gym_diary' },
        exposes: {
          './App': './src/App',
        },
        shared: {
          react: { singleton: true, requiredVersion: dependencies.react },
          'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
          'react-router-dom': { singleton: true, requiredVersion: dependencies['react-router-dom'] },
          '@emotion/react': { singleton: true, requiredVersion: dependencies['@emotion/react'] },
          '@emotion/styled': { singleton: true, requiredVersion: dependencies['@emotion/styled'] },
          '@fontsource/roboto': { singleton: true, requiredVersion: dependencies['@fontsource/roboto'] },
          '@mui/icons-material': { singleton: true, requiredVersion: dependencies['@mui/icons-material'] },
          '@mui/material': { singleton: true, requiredVersion: dependencies['@mui/material'] },
          '@mui/x-date-pickers': { singleton: true, requiredVersion: dependencies['@mui/x-date-pickers'] },
        },
      }),
    ],
  },
};
