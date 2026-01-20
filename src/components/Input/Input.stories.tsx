// Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/preact";
import { useState } from "preact/hooks";
import Input from "./Input";

// Inline SVG icons to avoid react-icons/Vite optimize issues in Storybook.
// Your component imports react-icons internally; this keeps the story itself clean.
const meta: Meta<typeof Input> = {
  title: "components/Input",
  component: Input,
  parameters: { layout: "centered" },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["default", "error", "success"],
    },
    label: { control: "text" },
    value: { control: false }, // controlled via wrapper state
    onInput: { action: "input" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    hint: { control: "text" },
    showClear: { control: "boolean" },
    onClear: { action: "clear" },
    name: { control: "text" },
    type: { control: "text" }, // note: component currently hardcodes type="text"
  },
  args: {
    label: "Input label",
    placeholder: "placeholder",
    required: false,
    disabled: false,
    state: "default",
    hint: "",
    showClear: true,
    name: "field",
    type: "text",
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

function Controlled(args: any) {
  const [value, setValue] = useState("hello");

  return (
    <div class="w-80">
      <Input
        {...args}
        value={value}
        onInput={(next) => {
          setValue(next);
          args.onInput?.(next);
        }}
        onClear={() => {
          args.onClear?.();
          setValue("");
        }}
        hint={args.hint || undefined}
      />
    </div>
  );
}

/** Playground (controlled) */
export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
};

/** States */
export const States: Story = {
  render: (args) => (
    <div class="w-80 flex flex-col gap-4">
      <Controlled
        {...args}
        state="default"
        label="default"
        hint="helper text"
      />
      <Controlled
        {...args}
        state="error"
        label="error"
        hint="something went wrong"
      />
      <Controlled {...args} state="success" label="success" hint="looks good" />
    </div>
  ),
};

/** Required */
export const Required: Story = {
  args: { required: true, hint: "" },
  render: (args) => <Controlled {...args} label="required field" />,
};

/** Disabled */
export const Disabled: Story = {
  args: { disabled: true, hint: "disabled" },
  render: (args) => <Controlled {...args} label="disabled" />,
};
