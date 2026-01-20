// Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/preact";
import Card from "./Card";
import { FaRegUser } from "react-icons/fa6";

const meta: Meta<typeof Card> = {
  title: "components/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    text: { control: "text" },
    buttonLabel: { control: "text" },
    buttonIcon: { control: false },
  },
  args: {
    text: "Join the family.",
    buttonLabel: "Become a member",
    buttonIcon: <FaRegUser />,
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

/** Playground */
export const Playground: Story = {};

/** No icon */
export const NoIcon: Story = {
  args: {
    text: "Join the family.",
    buttonLabel: "Become a member",
    buttonIcon: undefined,
  },
};
