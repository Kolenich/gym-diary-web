import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { container } from 'webpack';

import { dependencies as deps, name } from '../package.json';

const { ModuleFederationPlugin } = container;

export const resolvePath = (path: string): string => resolve(process.cwd(), path);

export const srcFolders = readdirSync('src', { withFileTypes: true })
  .filter(directory => directory.isDirectory())
  .map(directory => directory.name);

export const publicFolders = readdirSync('public', { withFileTypes: true })
  .filter(directory => directory.isDirectory())
  .map(directory => directory.name);

const tsConfigPathsString = readFileSync('tsconfig.json', 'utf8');
const tsConfigPaths = JSON.parse(tsConfigPathsString);

tsConfigPaths.compilerOptions.paths = {
  ...publicFolders.reduce(
    (prevPaths, currFolder) => ({
      ...prevPaths,
      [`${currFolder}/*`]: [`public/${currFolder}/*`],
    }),
    {} as Record<string, string[]>,
  ),
  ...srcFolders.reduce(
    (prevPaths, currFolder) => ({
      ...prevPaths,
      [`${currFolder}/*`]: [`src/${currFolder}/*`],
    }),
    {} as Record<string, string[]>,
  ),
};

writeFileSync('tsconfig.json', JSON.stringify(tsConfigPaths, null, 2));

export const commonPlugins = [
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].css',
  }),
  new ModuleFederationPlugin({
    name,
    filename: 'remoteEntry.js',
    exposes: {
      './WorkoutsSchedule': resolvePath('src/pages/WorkoutSchedule/WorkoutSchedule'),
    },
    shared: {
      react: { singleton: true, requiredVersion: deps.react },
      'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
    },
  }),
];
