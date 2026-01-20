import { FaChevronDown } from "react-icons/fa6";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { type ComponentChildren } from "preact";

type Option = { label: string; value: string };

type DropdownProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: Option[];

  required?: boolean;
  disabled?: boolean;
  hint?: string;
  name?: string;
  icon?: ComponentChildren;
};

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function CustomDropdown({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  hint,
  name,
  icon,
}: DropdownProps) {
  const id = useId();
  const helpId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  const hasValue = value.length > 0;
  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  const borderClass = useMemo(() => {
    if (disabled) return "";
    return "border-xs border-border-passive";
  }, [disabled]);

  const containerBg = useMemo(() => {
    if (disabled) return "bg-surface-disabled-dark";
    if (hasValue) return "bg-surface-page";
    return "bg-white";
  }, [disabled, hasValue]);

  const helperText = hint ?? (required ? "required" : "");
  const describedBy = helperText ? helpId : undefined;

  // Keep active index synced to selected value when value changes externally
  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setActiveIndex(idx);
  }, [value, options]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && rootRef.current && !rootRef.current.contains(t)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // When opening, move focus/scroll to active option
  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-opt-index="${activeIndex}"]`,
      );
      el?.scrollIntoView({ block: "nearest" });
    });
  }, [open, activeIndex]);

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const move = (dir: 1 | -1) => {
    const next = (activeIndex + dir + options.length) % options.length;
    setActiveIndex(next);
  };

  const toggle = () => {
    if (disabled) return;
    buttonRef.current?.focus();
    setOpen((v) => !v);
  };

  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else move(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) setOpen(true);
        else commit(activeIndex);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const onListKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      onClick={(e) => {
        if (disabled) return;
        const target = e.target as HTMLElement;

        // If click is inside the menu itself, don't toggle (option clicks handle selection)
        if (target.closest('[data-role="menu"]')) return;

        toggle();
      }}
    >
      <div
        class={cn(
          "relative rounded-md flex items-center px-sm",
          containerBg,
          borderClass,
        )}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target?.closest('[data-role="toggle"]')) return;
          if (disabled) return;
          buttonRef.current?.focus();
          setOpen((v) => !v);
        }}
      >
        {icon && (
          <div class={cn("mr-2", disabled && "text-text-action-disabled")}>
            {icon}
          </div>
        )}

        {/* Hidden input for form posts (optional) */}
        {name && <input type="hidden" name={name} value={value} />}

        <button
          ref={buttonRef}
          id={id}
          type="button"
          data-role="toggle"
          disabled={disabled}
          aria-describedby={describedBy}
          aria-expanded={open ? "true" : "false"}
          aria-controls={`${id}-listbox`}
          class={cn(
            "block py-md w-full text-action-md font-medium bg-transparent appearance-none text-left",
            !hasValue && "text-text-passive",
            disabled && "text-text-passive",
          )}
          onKeyDown={onButtonKeyDown as any}
        >
          {/* Use label as placeholder */}
          {selected ? selected.label : "‎"}
        </button>

        <button
          type="button"
          aria-label="toggle dropdown"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          class={cn("ml-2", disabled ? "text-text-passive" : "text-text-body")}
        >
          <span
            class={cn(
              "inline-block transition-transform duration-200",
              open && "rotate-180",
              disabled && "text-text-action-disabled",
            )}
            aria-hidden="true"
          >
            <FaChevronDown />
          </span>
        </button>

        <label
          for={id}
          class={cn(
            "absolute text-body-md text-body font-family-paragraph duration-300 transform origin-left px-2 start-1 z-10",
            containerBg,
            hasValue || open
              ? "scale-75 -translate-y-4 top-1 mx-0"
              : "scale-100 -translate-y-1/2 top-1/2 text-text-passive",
            disabled && "text-text-passive",
            !!icon && "mx-6",
          )}
        >
          {label}
        </label>

        {open && !disabled && (
          <div class="absolute left-0 right-0 top-full mt-1 z-50">
            <ul
              id={`${id}-listbox`}
              ref={listRef}
              role="listbox"
              aria-labelledby={id}
              tabIndex={-1}
              onKeyDown={onListKeyDown as any}
              class={cn(
                "max-h-64 overflow-auto rounded-md border-xs border-border-passive bg-white shadow-md",
              )}
            >
              {options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isActive = idx === activeIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected ? "true" : "false"}
                    data-opt-index={idx}
                    class={cn(
                      "px-sm py-sm text-sm font-family-paragraph cursor-pointer select-none",
                      isActive && "bg-surface-page",
                      isSelected && "text-text-action-active",
                    )}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      // prevent button losing focus before click fires
                      e.preventDefault();
                    }}
                    onClick={() => commit(idx)}
                  >
                    {opt.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div class="flex items-center text-body-xs">
        {required && <span class="text-text-warning">*</span>}
        <span id={helpId} class="text-text-passive">
          {helperText}
        </span>
      </div>
    </div>
  );
}
