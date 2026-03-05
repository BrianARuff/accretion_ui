import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, '..');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal: async (baseConfig) => {
    const forcedAliases = {
      react: path.resolve(projectRoot, 'node_modules/react'),
      'react-dom': path.resolve(projectRoot, 'node_modules/react-dom')
    };

    baseConfig.resolve ??= {};

    if (Array.isArray(baseConfig.resolve.alias)) {
      baseConfig.resolve.alias = [
        ...baseConfig.resolve.alias,
        { find: 'react', replacement: forcedAliases.react },
        { find: 'react-dom', replacement: forcedAliases['react-dom'] }
      ];
    } else {
      baseConfig.resolve.alias = {
        ...(baseConfig.resolve.alias ?? {}),
        ...forcedAliases
      };
    }

    return baseConfig;
  }
};

export default config;
