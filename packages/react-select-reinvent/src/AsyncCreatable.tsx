import * as React from "react";
import {
  forwardRef,
  MutableRefObject,
  ReactElement,
  RefAttributes,
} from "react";
import Select from "./Select";
import { GroupBase } from "./types";
import useAsync, { AsyncAdditionalProps } from "./useAsync";
import useStateManager, { StateManagerProps } from "./useStateManager";
import useCreatable, { CreatableAdditionalProps } from "./useCreatable";

export type AsyncCreatableProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = StateManagerProps<Option, IsMulti, Group> &
  CreatableAdditionalProps<Option, Group> &
  AsyncAdditionalProps<Option, Group>;

// async creatable Select
type AsyncCreatableSelect = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: AsyncCreatableProps<Option, IsMulti, Group> &
    RefAttributes<Select<Option, IsMulti, Group>>
) => ReactElement;

const AsyncCreatableSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: AsyncCreatableProps<Option, IsMulti, Group>,
    ref:
      | ((instance: Select<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<Select<Option, IsMulti, Group> | null>
      | null
  ) => {
    const stateManagerProps = useAsync(props);
    const creatableProps = useStateManager(stateManagerProps);
    const selectProps = useCreatable(creatableProps);

    return <Select ref={ref} {...selectProps} />;
  }
) as AsyncCreatableSelect;

export default AsyncCreatableSelect;
