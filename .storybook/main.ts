// .storybook/main.ts
import type { StorybookConfig } from "@storybook/preact-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/preact-vite",
  staticDirs: [{ from: "../build/web", to: "/build/web" }],

  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          react: "preact/compat",
          "react-dom": "preact/compat",
          "react/jsx-runtime": "preact/jsx-runtime",
        },
      },
      optimizeDeps: {
        // For the "Outdated Optimize Dep" 504 loop with react-icons:
        exclude: ["react-icons", "react-icons/fa", "react-icons/fa6"],
      },
    });
  },
};

export default config;
