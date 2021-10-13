import customizer from 'customize-cra';

module.exports = customizer.override(
  customizer.addBabelPlugin([
    'module-resolver',
    {
      alias: {
        '^components/*': './src/pages/*',
        '^context/*': './src/context/*',
        '^types/*': './src/types/*',
        '^routers/*': './src/routers/*',
        '^lib/*': './src/lib/*',
        '^pages/*': './src/pages/*',
        '^img/*': './src/img/*',
      },
    },
  ]),
);
