import customizer from 'customize-cra';

module.exports = customizer.override(
  customizer.addBabelPlugin([
    'module-resolver',
    {
      alias: {
        '^components/*': './src/pages/*',
        '^api/*': './src/api/*',
        '^context/*': './src/context/*',
        '^types/*': './src/types/*',
        '^routes/*': './src/routers/*',
        '^lib/*': './src/lib/*',
        '^pages/*': './src/pages/*',
      },
    },
  ]),
);
