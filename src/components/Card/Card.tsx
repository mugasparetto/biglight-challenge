import { type ComponentChildren } from "preact";
import Button from "../Button/Button";

type Props = {
  text: string;
  buttonLabel: string;
  buttonIcon?: ComponentChildren;
};

export default function Card({ text, buttonLabel, buttonIcon }: Props) {
  return (
    <div class="flex md:w-98.5 w-73.75 bg-surface-brand-secondary p-lg rounded-xl justify-between">
      <div class="flex flex-col gap-lg align-start items-start">
        <h5 class="text-heading-h5 font-family-headings text-text-action-inverse leading-[120%] w-32.75">
          {text}
        </h5>
        <Button size="sm" leftIcon={buttonIcon}>
          {buttonLabel}
        </Button>
      </div>
      <svg
        width="145"
        height="146"
        viewBox="0 0 145 146"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-21 h-21 justify-self-end md:w-36 md:h-36.5"
      >
        <g clip-path="url(#clip0_2183_4939)">
          <mask id="path-1-inside-1_2183_4939" fill="white">
            <path d="M0 8C0 3.58173 3.58172 0 8 0H136.413C140.831 0 144.413 3.58172 144.413 8V138C144.413 142.418 140.831 146 136.413 146H7.99999C3.58172 146 0 142.418 0 138V8Z" />
          </mask>
          <path
            d="M0 8C0 3.58173 3.58172 0 8 0H136.413C140.831 0 144.413 3.58172 144.413 8V138C144.413 142.418 140.831 146 136.413 146H7.99999C3.58172 146 0 142.418 0 138V8Z"
            fill="#FAF9F5"
          />
          <path
            d="M1.94922 72.8495H72.1168V143.761L1.94922 72.8495Z"
            fill="#FC4C02"
          />
          <path
            d="M1.94922 2.67896L72.1168 72.8495M142.284 143.761L72.1168 72.8495M72.1168 72.8495H1.94922L72.1168 143.761V72.8495Z"
            stroke="black"
            stroke-width="1.5"
          />
        </g>
        <path
          d="M8 1.5H136.413V-1.5H8V1.5ZM142.913 8V138H145.913V8H142.913ZM136.413 144.5H7.99999V147.5H136.413V144.5ZM1.5 138V8H-1.5V138H1.5ZM7.99999 144.5C4.41014 144.5 1.5 141.59 1.5 138H-1.5C-1.5 143.247 2.75329 147.5 7.99999 147.5V144.5ZM142.913 138C142.913 141.59 140.003 144.5 136.413 144.5V147.5C141.66 147.5 145.913 143.247 145.913 138H142.913ZM136.413 1.5C140.003 1.5 142.913 4.41015 142.913 8H145.913C145.913 2.7533 141.66 -1.5 136.413 -1.5V1.5ZM8 -1.5C2.75329 -1.5 -1.5 2.7533 -1.5 8H1.5C1.5 4.41015 4.41015 1.5 8 1.5V-1.5Z"
          fill="black"
          mask="url(#path-1-inside-1_2183_4939)"
        />
        <defs>
          <clipPath id="clip0_2183_4939">
            <path
              d="M0 8C0 3.58173 3.58172 0 8 0H136.413C140.831 0 144.413 3.58172 144.413 8V138C144.413 142.418 140.831 146 136.413 146H7.99999C3.58172 146 0 142.418 0 138V8Z"
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
