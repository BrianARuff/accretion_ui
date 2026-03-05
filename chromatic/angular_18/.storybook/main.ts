import type { StorybookConfig } from '@storybook/angular';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-a11y'],

  framework: {
    name: '@storybook/angular',
    options: {}
  },
  webpackFinal: async (baseConfig) => ({
    ...baseConfig,
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...(baseConfig.resolve?.alias ?? {}),
        '@angular/core$': path.resolve(storybookDir, '../node_modules/@angular/core/fesm2022/core.mjs')
      }
    }
  })
};

export default config;
