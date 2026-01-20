// Dropdown.stories.tsx
import type { Meta, StoryObj } from "@storybook/preact";
import { useMemo, useState } from "preact/hooks";
import { FaRegClock } from "react-icons/fa6";
import Dropdown from "./Dropdown";

type Option = { label: string; value: string };

const baseOptions: Option[] = [
  { label: "morning", value: "morning" },
  { label: "afternoon", value: "afternoon" },
  { label: "evening", value: "evening" },
  { label: "night", value: "night" },
];

const manyOptions: Option[] = Array.from({ length: 30 }).map((_, i) => ({
  label: `option ${String(i + 1).padStart(2, "0")}`,
  value: `opt-${i + 1}`,
}));

const meta: Meta<typeof Dropdown> = {
  title: "components/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
    value: { control: false }, // controlled wrapper
    onChange: { action: "change" },
    options: { control: false },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    hint: { control: "text" },
    name: { control: "text" },
    icon: { control: false },
  },
  args: {
    label: "time of day",
    required: false,
    disabled: false,
    hint: "",
    name: "timeOfDay",
  },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

function Controlled(args: any) {
  const [value, setValue] = useState<string>(args.value ?? "");

  // Keep local state in sync if a story sets args.value (rare, but useful)
  const externalValue = args.value as string | undefined;
  const currentValue = externalValue !== undefined ? externalValue : value;

  const options = useMemo<Option[]>(
    () => (args.options as Option[]) ?? baseOptions,
    [args.options],
  );

  return (
    <div class="w-80">
      <Dropdown
        {...args}
        options={options}
        value={currentValue}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
        hint={args.hint || undefined}
      />
      <div class="mt-2 text-body-xs text-text-passive">
        value: <span class="font-mono">{currentValue || "∅"}</span>
      </div>
    </div>
  );
}

/** Playground (controlled) */
export const Playground: Story = {
  render: (args) => (
    <Controlled {...args} options={baseOptions} icon={<FaRegClock />} />
  ),
};

/** Default vs selected */
export const PlaceholderAndSelected: Story = {
  render: (args) => (
    <div class="w-[320px] flex flex-col gap-4">
      <Controlled {...args} label="no selection" options={baseOptions} />
      <Controlled
        {...args}
        label="with selection"
        options={baseOptions}
        value="afternoon"
      />
    </div>
  ),
};

/** Required + helper text */
export const Required: Story = {
  args: { required: true, hint: "" },
  render: (args) => (
    <Controlled {...args} options={baseOptions} label="required field" />
  ),
};

/** Disabled */
export const Disabled: Story = {
  args: { disabled: true, hint: "disabled" },
  render: (args) => (
    <div class="w-[320px] flex flex-col gap-4">
      <Controlled {...args} options={baseOptions} label="disabled (empty)" />
      <Controlled
        {...args}
        options={baseOptions}
        label="disabled (selected)"
        value="evening"
      />
    </div>
  ),
};
