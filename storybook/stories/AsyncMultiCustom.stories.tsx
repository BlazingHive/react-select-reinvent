import type { ComponentMeta } from "@storybook/react";
import * as React from "react";
import AsyncSelect from "../../packages/react-select-reinvent/async";

import { Field } from "../components";
import { ColourOption, colourOptions } from "../data";

export function AsyncMultiCustom() {
  return (
    <Field
      label="Async Multi Custom"
      htmlFor="async-multi-custom-id"
      secondaryLabel="Async Select swith loading options"
    >
      <AsyncSelect
        inputId="async-multi-custom-id"
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
      />
    </Field>
  );
}

const filterColors = (inputValue: string) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

// a mock api call to get values from backend
const promiseOptions = (inputValue: string) => {
  return new Promise<ColourOption[]>((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 2000);
  });
};

export default {
  title: "Select/AsyncMultiCustom",
  component: AsyncSelect,
} as ComponentMeta<typeof AsyncSelect>;
