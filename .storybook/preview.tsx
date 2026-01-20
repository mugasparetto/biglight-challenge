import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview, Decorator } from "@storybook/preact";
import "../src/index.css";
import { applyTheme, type ThemeName } from "../src/theme/applyTheme";

const LoadRuntimeTokens: Decorator = (StoryFn, context) => {
  const theme = (context.globals.theme as ThemeName) ?? "brandA";
  applyTheme(theme);
  return StoryFn();
};

const preview: Preview = {
  initialGlobals: {
    theme: "brandA",
  },

  globalTypes: {
    theme: {
      defaultValue: "brandA",
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        brandA: "brandA",
        brandB: "brandB",
      },
      defaultTheme: "brandA",
      attributeName: "data-theme",
    }),
    LoadRuntimeTokens,
  ],
};

export default preview;
