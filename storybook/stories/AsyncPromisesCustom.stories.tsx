import type { ComponentMeta } from "@storybook/react";
import * as React from "react";
import AsyncSelect from "../../packages/react-select-reinvent/src/Async";

import { Field } from "../components";
import { ColourOption, colourOptions } from "../data";

export const AsyncPromisesCustom: React.FC = () => {
  return (
    <Field
      label="Async Promises Custom Component"
      htmlFor="async-promises-custom-id"
      secondaryLabel="Async Select with loading options and one selection support"
    >
      <AsyncSelect
        inputId="async-promises-custom-id"
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    </Field>
  );
};

export default {
  title: "Select/AsyncPromisesCustom",
  component: {},
  argTypes: {},
} as ComponentMeta<typeof AsyncSelect>;

// =============================================================================
// Utils
// =============================================================================

function filterColors(inputValue: string) {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
}

function promiseOptions(inputValue: string) {
  return new Promise<ColourOption[]>((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 4000);
  });
}
