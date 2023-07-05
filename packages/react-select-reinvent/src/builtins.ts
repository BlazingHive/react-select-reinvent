import { GroupBase } from "./types";

// form group label util
export const formatGroupLabel = <Option, Group extends GroupBase<Option>>(
  group: Group
): string => group.label as string;

// get option label util
export const getOptionLabel = <Option>(option: Option): string =>
  (option as { label?: unknown }).label as string;

// as option value util
export const getOptionValue = <Option>(option: Option): string =>
  (option as { value?: unknown }).value as string;

// is option disabled util
export const isOptionDisabled = <Option>(option: Option): boolean =>
  !!(option as { isDisabled?: unknown }).isDisabled;
