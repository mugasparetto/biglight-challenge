import type { Meta, StoryObj } from "@storybook/preact";
import Button from "./Button";

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

const meta: Meta<typeof Button> = {
  title: "components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
    },
    size: { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    leftIcon: { control: false },
    rightIcon: { control: false },
    onClick: { action: "clicked" },
    children: { control: "text" },
  },
  args: {
    children: "Button label",
    variant: "primary",
    size: "md",
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const WithIcons: Story = {
  render: (args) => (
    <Button {...args} leftIcon={<ChevronLeft />} rightIcon={<ChevronRight />}>
      Button label
    </Button>
  ),
};
