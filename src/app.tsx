import Button from "./components/Button/Button";
import Input from "./components/Input/Input";
import Dropdown from "./components/Dropdown/Dropdown";
import Card from "./components/Card/Card";
import { applyTheme } from "./theme/applyTheme";
import { useEffect } from "preact/hooks";
import { FaRegUser, FaXmark } from "react-icons/fa6";

function App() {
  useEffect(() => {
    applyTheme("brandA");
  }, []);

  return (
    <div class="flex align-middle justify-center">
      <div class="flex flex-col w-120 p-2xl gap-2xl">
        <button class="self-end" aria-label="close">
          <span class="[&>svg]:w-4 [&>svg]:h-4">
            <FaXmark />
          </span>
        </button>

        <h4 class="text-heading-h4 font-family-headings font-medium text-text-brand w-80">
          Log into your account
        </h4>

        <span class="text-body-md font-family-paragraph">
          Please enter your email for a one-time-only code
        </span>

        <div class="flex flex-col gap-xl">
          <Dropdown
            label="Customer type"
            options={[
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
              { value: "option3", label: "Option 3" },
            ]}
            value=""
            onChange={() => {}}
          />

          <Input label="Email" value="" onInput={() => {}} />
        </div>

        <div class="flex flex-col gap-md">
          <Button variant="secondary">Continue</Button>
          <Button variant="tertiary">Login with your password</Button>
        </div>

        <Card
          text="Join the family."
          buttonLabel="Become a member"
          buttonIcon={
            <span class="[&>svg]:w-4 [&>svg]:h-4">
              <FaRegUser />
            </span>
          }
        />
      </div>
    </div>
  );
}

export default App;
