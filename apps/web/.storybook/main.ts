import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-interactions",
    "@storybook/addon-links"
  ],
  "framework": {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@storybook/test": path.resolve(process.cwd(), "node_modules/@storybook/test"),
        },
      },
    });
  },

};
export default config;