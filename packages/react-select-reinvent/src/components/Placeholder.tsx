/** @jsx jsx */
import { ReactNode } from "react";
import { jsx } from "@emotion/react";
import {
  CommonPropsAndClassName,
  CSSObjectWithLabel,
  GroupBase,
} from "../types";
import { getStyleProps } from "../utils";

// placer holder props
export interface PlaceholderProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
  /** The children to be rendered. */
  // ?? what is the children of placeholder, is it string content?
  children: ReactNode;
  /** props passed to the wrapping element for the group. */
  innerProps: JSX.IntrinsicElements["div"];
  isDisabled: boolean;
  isFocused: boolean;
}

// generate placeholder props based on params
export const placeholderCSS = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  { theme: { spacing, colors } }: PlaceholderProps<Option, IsMulti, Group>,
  unstyled: boolean
): CSSObjectWithLabel => ({
  label: "placeholder",
  gridArea: "1 / 1 / 2 / 3",
  ...(unstyled
    ? {}
    : {
        color: colors.neutral50,
        marginLeft: spacing.baseUnit / 2,
        marginRight: spacing.baseUnit / 2,
      }),
});

// place holder component
const Placeholder = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: PlaceholderProps<Option, IsMulti, Group>
) => {
  const { children, innerProps } = props;
  return (
    <div
      {...getStyleProps(props, "placeholder", {
        placeholder: true,
      })}
      {...innerProps}
    >
      {children}
    </div>
  );
};

export default Placeholder;
