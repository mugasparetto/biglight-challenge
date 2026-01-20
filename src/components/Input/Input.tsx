import { FaXmark, FaCheck } from "react-icons/fa6";
import { useId, useMemo, useRef } from "preact/hooks";

type InputState = "default" | "error" | "success";

type InputProps = {
  label: string;
  value: string;
  onInput: (next: string) => void;

  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  state?: InputState;
  hint?: string;
  showClear?: boolean;
  onClear?: () => void;
  name?: string;
  type?: string;
};

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function Input({
  label,
  value,
  onInput,
  required = false,
  disabled = false,
  state = "default",
  hint,
  showClear = true,
  onClear,
  name,
}: InputProps) {
  const id = useId();
  const helpId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const isError = state === "error";
  const isSuccess = state === "success";

  const borderClass = useMemo(() => {
    if (disabled) return "";
    if (isError) return "border border-border-error";
    return "border-xs border-border-passive";
  }, [disabled, isError]);

  const hasValue = value.length > 0;
  const showRightClear = showClear && !isSuccess;
  const showRightSuccess = !disabled && isSuccess;

  const containerBg = useMemo(() => {
    if (disabled) return "bg-surface-disabled-dark";
    if (hasValue && !isError && !isSuccess) return "bg-surface-page";
    return "bg-white";
  }, [disabled, isError, hasValue, isSuccess]);

  const iconClass = useMemo(() => {
    if (disabled) return "text-text-passive";
    if (isError) return "text-text-error";
    return "text-text-action-active";
  }, []);

  const helperText = hint ?? (required ? "required" : "");
  const describedBy = helperText ? helpId : undefined;

  return (
    <div>
      <div
        class={cn(
          "relative rounded-md flex items-center px-sm",
          containerBg,
          borderClass,
        )}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target?.closest("button")) return;
          if (target?.closest("input")) return;
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          disabled={disabled}
          required={required}
          value={value}
          placeholder={" "} // keep " " so :placeholder-shown work
          onInput={(e) => onInput((e.currentTarget as HTMLInputElement).value)}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={describedBy}
          class={cn(
            "block py-md w-full text-sm text-heading font-family-paragraph bg-transparent appearance-none peer",
            isError && "text-text-error",
            disabled && "text-text-passive",
          )}
        />
        <label
          for={id}
          class={cn(
            "absolute text-body-md text-body font-family-paragraph duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-left px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 peer-focus:text-text-body",
            containerBg,
            isError ? "text-text-error" : "text-text-passive",
          )}
        >
          {label}
        </label>
        <div class="flex items-center">
          {showRightClear && (
            <button
              type="button"
              aria-label="clear input"
              class={iconClass}
              onClick={(e) => {
                e.stopPropagation();

                // keep the input focused and stable immediately
                inputRef.current?.focus();

                onClear?.();
                onInput("");
              }}
            >
              <FaXmark />
            </button>
          )}
          {showRightSuccess && (
            <span class="text-icon-color-positive" aria-label="success">
              <FaCheck />
            </span>
          )}
        </div>
      </div>
      <div class="flex items-center text-body-xs">
        {required && <span class="text-text-warning">*</span>}
        <span
          id={helpId}
          class="text-text-passive"
          {...(isError ? { role: "alert" as const } : {})}
        >
          {helperText}
        </span>
      </div>
    </div>
  );
}
