import { CSSObject } from "@emotion/react";
import { Props } from "./Select";
import { StylesProps } from "./styles";

// one group-selection interface
// generic type: Option, client defined type
export interface GroupBase<Option> {
  // options of this group
  readonly options: readonly Option[];
  // label of this group
  readonly label?: string;
}

// Array of (Option | Group)
export type OptionsOrGroups<
  Option,
  Group extends GroupBase<Option>
> = readonly (Option | Group)[];

// Array of Option, call it Options
export type Options<Option> = readonly Option[];

// Single Option is either one Option or null
// ?? Why null
export type SingleValue<Option> = Option | null;

// Multi Options, the same as Options<Option>
export type MultiValue<Option> = readonly Option[];

// An inclusive type that accommodates both multi-value and single value
export type PropsValue<Option> = MultiValue<Option> | SingleValue<Option>;

// onChange Value for either multi-value Select or single value Selct
// using isMulti to determine
export type OnChangeValue<
  Option,
  IsMulti extends boolean
> = IsMulti extends true ? MultiValue<Option> : SingleValue<Option>;

// def of a set of colors: one color scheme
export interface Colors {
  primary: string;
  primary75: string;
  primary50: string;
  primary25: string;

  danger: string;
  dangerLight: string;

  neutral0: string;
  neutral5: string;
  neutral10: string;
  neutral20: string;
  neutral30: string;
  neutral40: string;
  neutral50: string;
  neutral60: string;
  neutral70: string;
  neutral80: string;
  neutral90: string;
}

// spcaing definition
export interface ThemeSpacing {
  // base unit for the whole select
  baseUnit: number;
  // ??
  controlHeight: number;
  // space between menu container left border and menu
  menuGutter: number;
}

// theme definition
export interface Theme {
  // border radius
  borderRadius: number;
  // color definitions for this theme, need to define all these colors for interface Colors
  colors: Colors;
  // spacing definition
  spacing: ThemeSpacing;
}

// classnames on & off toggle
export type ClassNamesState = { [key: string]: boolean };

// filtering operation to toggle on-off from second parameter to the end
// and join into one string
export type CX = (
  state: ClassNamesState,
  ...classNames: (string | undefined)[]
) => string;

/**
 * Get the styles of a particular part of the select. Pass in the name of the
 * property as the first argument, and the current props as the second argument.
 * See the `styles` object for the properties available.
 */
export type GetStyles<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
  propertyName: Key,
  props: StylesProps<Option, IsMulti, Group>[Key]
) => CSSObjectWithLabel;

export interface CommonProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  // cluear value func
  clearValue: () => void;
  // classname state
  cx: CX;
  // get styles for a particular part of the select
  getStyles: GetStyles<Option, IsMulti, Group>;
  // ??
  getClassNames: <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    propertyName: Key,
    props: StylesProps<Option, IsMulti, Group>[Key]
  ) => string | undefined;
  // get value of Select. ?? Why Array of Option
  getValue: () => Options<Option>;
  // has option selected
  hasValue: boolean;
  // is this Select multi-select
  isMulti: boolean;
  // ?? Is the select direction right-to-left
  isRtl: boolean;
  // Array of Option || Array of Group depends on if this Select is grouped Select
  options: OptionsOrGroups<Option, Group>;
  // select an option
  selectOption: (newValue: Option) => void;
  // Select props
  selectProps: Props<Option, IsMulti, Group>;
  // set value action func: select option or deselect option
  setValue: (
    newValue: OnChangeValue<Option, IsMulti>,
    action: SetValueAction,
    option?: Option
  ) => void;
  // theme definition
  theme: Theme;
}

// extend CommonProps with ClassName
export interface CommonPropsAndClassName<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> extends CommonProps<Option, IsMulti, Group> {
  className?: string | undefined;
}
// base action type to be extended
export interface ActionMetaBase<Option> {
  option?: Option | undefined;
  removedValue?: Option;
  removedValues?: Options<Option>;
  name?: string;
}

// select action data
export interface SelectOptionActionMeta<Option> extends ActionMetaBase<Option> {
  // "select-option" action
  action: "select-option";
  // selected option by this action
  option: Option | undefined;
  // ??
  name?: string;
}

// select action data
export interface DeselectOptionActionMeta<Option>
  extends ActionMetaBase<Option> {
  // "deselect-option" action
  action: "deselect-option";
  // deselected option by this action
  option: Option | undefined;
  // ??
  name?: string;
}

// remove action data
export interface RemoveValueActionMeta<Option> extends ActionMetaBase<Option> {
  action: "remove-value";
  removedValue: Option;
  name?: string;
}

// ??
export interface PopValueActionMeta<Option> extends ActionMetaBase<Option> {
  action: "pop-value";
  removedValue: Option;
  name?: string;
}

// clear whole selected values
export interface ClearActionMeta<Option> extends ActionMetaBase<Option> {
  action: "clear";
  removedValues: Options<Option>;
  name?: string;
}

// ??
export interface CreateOptionActionMeta<Option> extends ActionMetaBase<Option> {
  action: "create-option";
  name?: string;
  option: Option;
}

// ?
export interface InitialInputFocusedActionMeta<Option, IsMulti extends boolean>
  extends ActionMetaBase<Option> {
  action: "initial-input-focus";
  value: OnChangeValue<Option, IsMulti>;
  options?: Options<Option>;
}

// All actions (triggered by user) meta data type
export type ActionMeta<Option> =
  | SelectOptionActionMeta<Option>
  | DeselectOptionActionMeta<Option>
  | RemoveValueActionMeta<Option>
  | PopValueActionMeta<Option>
  | ClearActionMeta<Option>
  | CreateOptionActionMeta<Option>;

// set(select or deselect) action name
export type SetValueAction = "select-option" | "deselect-option";

// ??
export type InputAction =
  | "set-value"
  | "input-change"
  | "input-blur"
  | "menu-close";

// input action data
export interface InputActionMeta {
  action: InputAction;
  /** The previous value of the search input. */
  prevInputValue: string;
}

// menu placement
export type MenuPlacement = "auto" | "bottom" | "top";

// menu open up or down
export type CoercedMenuPlacement = "bottom" | "top";

// menu position
export type MenuPosition = "absolute" | "fixed";

// ??
export type FocusDirection =
  | "up"
  | "down"
  | "pageup"
  | "pagedown"
  | "first"
  | "last";

// get label func
export type GetOptionLabel<Option> = (option: Option) => string;

// get value func
export type GetOptionValue<Option> = (option: Option) => string;

// ??
export type CSSObjectWithLabel = CSSObject & { label?: string };
