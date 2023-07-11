import type { ComponentMeta } from "@storybook/react";
import * as React from "react";
import AsyncCreatableSelect from "../../packages/react-select-reinvent/async-creatable";

import { Field } from "../components";
import { ColourOption, colourOptions } from "../data";

export function AsyncCreatableCustom() {
  return (
    <Field
      label="Async Creatable Custom"
      htmlFor="async-creatable-custom-id"
      secondaryLabel="Async Creatable Select supporting create and async"
    >
      <AsyncCreatableSelect
        inputId="async-creatable-custom-id"
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    </Field>
  );
}

export default {
  title: "Select/AsyncCreatableCustom",
  component: AsyncCreatableSelect,
} as ComponentMeta<typeof AsyncCreatableSelect>;

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
