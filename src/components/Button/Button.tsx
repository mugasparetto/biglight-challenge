import { type JSX } from "preact/jsx-runtime";
import { type ComponentChildren } from "preact";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md";
const iconSizes: Record<Size, string> = {
  sm: "[&>svg]:w-3 [&>svg]:h-3",
  md: "[&>svg]:w-4 [&>svg]:h-4",
};

type Props = JSX.HTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  leftIcon?: ComponentChildren;
  rightIcon?: ComponentChildren;
};

const base =
  "inline-flex items-center justify-center font-medium font-family-paragraph rounded-round leading-[110%] disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "py-sm px-md text-action-sm",
  md: "p-(--spacing-md) text-action-md",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-surface-action-primary text-text-action-onprimary hover:bg-surface-action-hover-primary hover:text-text-action-inverse disabled:bg-surface-disabled-dark disabled:text-text-action-disabled",
  secondary:
    "bg-surface-action-secondary text-text-action-onsecondary hover:bg-surface-action-hover-secondary hover:text-text-action-onprimary disabled:bg-surface-disabled-dark disabled:text-text-action-disabled",
  tertiary:
    "border-[1.5px] border-primary hover:bg-surface-action-hover-primary hover:text-text-action-inverse disabled:border-disabled disabled:text-text-action-disabled",
};

export default function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  disabled = false,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      class={`${base} ${sizes[size]} ${variants[variant]}`}
      {...rest}
    >
      {leftIcon && <span class={iconSizes[size]}>{leftIcon}</span>}
      <span class="px-2">{children}</span>
      {rightIcon && <span class={iconSizes[size]}>{rightIcon}</span>}
    </button>
  );
}
