import type { StylesProps } from "./styles";
import type {
  ClassNamesState,
  CommonPropsAndClassName,
  GroupBase,
  InputActionMeta,
  MultiValue,
  OnChangeValue,
  Options,
  PropsValue,
  SingleValue,
} from "./types";

// ==============================
// NO OP
// ==============================

export const noop = () => {};
export const emptyString = () => "";

// ==============================
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/
function applyPrefixToName(prefix: string, name: string) {
  if (!name) {
    return prefix;
  } else if (name[0] === "-") {
    return prefix + name;
  } else {
    return prefix + "__" + name;
  }
}

// add classname prefix util func
export function classNames(
  prefix?: string | null,
  state?: ClassNamesState,
  ...classNameList: string[]
) {
  // parameters after state param are considered other classnames
  // that should be carried over (no need to add prefix for these classnames) as return
  const arr = [...classNameList];
  if (state && prefix) {
    for (let key in state) {
      // state[key] should be true, (toggle-on)
      // key: classname
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push(`${applyPrefixToName(prefix, key)}`);
      }
    }
  }

  return (
    arr
      // filter empty string ""
      .filter((i) => i)
      // remove extra space on both ends and join by one space: " "
      // good practice to keep only one space between each class
      .map((i) => String(i).trim())
      .join(" ")
  );
}
// ==============================
// Clean Value
// ==============================
// generic clean value func for multi as well as single
// make return consistent as Option[]
export const cleanValue = <Option>(
  value: PropsValue<Option>
): Options<Option> => {
  if (isArray(value)) return value.filter(Boolean);
  if (typeof value === "object" && value !== null) return [value];
  return [];
};

// ==============================
// Clean Common Props
// ==============================
// extract innerProps for internal usage
export const cleanCommonProps = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  AdditionalProps
>(
  props: Partial<CommonPropsAndClassName<Option, IsMulti, Group>> &
    AdditionalProps
): Omit<
  AdditionalProps,
  keyof CommonPropsAndClassName<Option, IsMulti, Group>
> => {
  //className
  const {
    className, // not listed in commonProps documentation, needs to be removed to allow Emotion to generate classNames
    clearValue,
    cx,
    getStyles,
    getClassNames,
    getValue,
    hasValue,
    isMulti,
    isRtl,
    options, // not listed in commonProps documentation
    selectOption,
    selectProps,
    setValue,
    theme, // not listed in commonProps documentation
    ...innerProps
  } = props;
  return { ...innerProps };
};

// ==============================
// Get Style Props
// ==============================

export const getStyleProps = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
  Key extends keyof StylesProps<Option, IsMulti, Group>
>(
  props: Pick<
    CommonPropsAndClassName<Option, IsMulti, Group>,
    "cx" | "getStyles" | "getClassNames" | "className"
  > &
    StylesProps<Option, IsMulti, Group>[Key],
  name: Key,
  classNamesState?: ClassNamesState
) => {
  const { cx, getStyles, getClassNames, className } = props;
  return {
    // css styles for a particular part of the select
    css: getStyles(name, props),
    // string of classname: "c1 c2 c3"
    className: cx(classNamesState ?? {}, getClassNames(name, props), className),
  };
};

// ==============================
// Handle Input Change
// ==============================

export function handleInputChange(
  inputValue: string,
  actionMeta: InputActionMeta,
  onInputChange?: (
    newValue: string,
    actionMeta: InputActionMeta
  ) => string | void
) {
  if (onInputChange) {
    // custom logic for onInputChange
    const newValue = onInputChange(inputValue, actionMeta);
    // return newValue if onInputChange returns string
    if (typeof newValue === "string") return newValue;
  }
  // if onInputChange was not passed into, return intact inputValue
  return inputValue;
}

// ==============================
// Scroll Helpers
// ==============================

export function isDocumentElement(
  el: HTMLElement | typeof window
): el is typeof window {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

// Normalized Scroll Top
// ------------------------------
// return innerHeight if el is document element
// else return clientHeight
export function normalizedHeight(el: HTMLElement | typeof window): number {
  if (isDocumentElement(el)) {
    return window.innerHeight;
  }

  return el.clientHeight;
}

// Normalized scrollTo & scrollTop
// ------------------------------
// get scrollY if document element
// else get scrollTop
export function getScrollTop(el: HTMLElement | typeof window): number {
  if (isDocumentElement(el)) {
    return window.scrollY;
  }
  return el.scrollTop;
}

// after get distance from getScrollTop, perform scrollTo/scrollTop operation
export function scrollTo(el: HTMLElement | typeof window, top: number): void {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

// Get Scroll Parent
// ------------------------------

export function getScrollParent(element: HTMLElement) {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRx = /(auto|scroll)/;

  // fixed means it's position is relative to documentElement
  // thus layout parent is documentElement
  if (style.position === "fixed") return document.documentElement;

  // bubble to top loop, which
  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    // get the computed style of parent
    style = getComputedStyle(parent);
    // if element's parent is static, skip this parent and bubble to its upper parent
    // Reason: position: "absolute" means: The element is removed from the normal document flow,
    //         and no space is created for the element in the page layout.
    //         It is positioned relative to its closest positioned ancestor, if any;
    //         A positioned element is an element whose computed position value is either relative, absolute, fixed, or sticky.
    //        (In other words, it's anything except static.)
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    // if any overflow settings contains auto or scroll, meaning this parent support scroll,
    // we find the parent.
    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  // if unfortunately, we did not find any parent after the loop, return documentElement
  return document.documentElement;
}

// Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/
// cubic easing function
// those kind of easing functions all satisfies the property:
//    f(t) when t = 0, f(t) = 0 and t = 1, f(t) = 1.
//    here f(t/d) = ((t/d) - 1) ^ 3 + 1, satisfying the criteria
function easeOutCubic(t: number, b: number, c: number, d: number): number {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

export function animatedScrollTo(
  element: HTMLElement | typeof window,
  to: number,
  duration = 200,
  callback: (element: HTMLElement | typeof window) => void = noop
) {
  const start = getScrollTop(element);
  const change = to - start;
  const increment = 10;
  let currentTime = 0;

  // TODO: there is an issue for this function:
  // How do we know that the increment = 10 (let's assume 10 miliseconds) equals to each loop's real
  // execution time. if it happens to be the same (or similar), then duration 200 really means 200 miliseconds
  // otherwise the duration is just a number (of course larger number means the animation will spend more time)
  function animateScroll() {
    currentTime += increment;
    const val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);
    if (currentTime < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      callback(element);
    }
  }
  animateScroll();
}

// Scroll Into View
// ------------------------------

// TODO: need more indept analysis
export function scrollIntoView(
  menuEl: HTMLElement,
  focusedEl: HTMLElement
): void {
  // get the bounding client rectangle for menu
  const menuRect = menuEl.getBoundingClientRect();
  // get the bounding client rectangle for the ele (option)
  const focusedRect = focusedEl.getBoundingClientRect();
  // The HTMLElement.offsetHeight read-only property
  // returns the height of an element, including vertical padding and borders, as an integer.
  // overScroll means we want to scroll more
  const overScroll = focusedEl.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    // scroll up
    scrollTo(
      menuEl,
      Math.min(
        focusedEl.offsetTop +
          focusedEl.clientHeight -
          menuEl.offsetHeight +
          overScroll,
        menuEl.scrollHeight
      )
    );
    // The top read-only property of the DOMRectReadOnly interface returns the top coordinate value of the DOMRect.
    // (Has the same value as y, or y + height if height is negative.)
  } else if (focusedRect.top - overScroll < menuRect.top) {
    // scroll down
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
}

// ==============================
// Get bounding client object
// ==============================

// cannot get keys using array notation with DOMRect
export function getBoundingClientObj(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  };
}

// rectangle definition
export interface RectType {
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

// ==============================
// String to Key (kebabify)
// ==============================

export function toKey(str: string) {
  return str.replace(/\W/g, "-");
}

// ==============================
// Touch Capability Detector
// ==============================

export function isTouchCapable() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

// ==============================
// Mobile Device Detector
// ==============================

export function isMobileDevice() {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch (e) {
    return false;
  }
}

// ==============================
// Passive Event Detector
// ==============================

// https://github.com/rafgraph/detect-it/blob/main/src/index.ts#L19-L36
let passiveOptionAccessed = false;
const options = {
  get passive() {
    return (passiveOptionAccessed = true);
  },
};
// check for SSR
const w:
  | typeof window
  | { addEventListener?: never; removeEventListener?: never } =
  typeof window !== "undefined" ? window : {};
if (w.addEventListener && w.removeEventListener) {
  w.addEventListener("p", noop, options);
  w.removeEventListener("p", noop, false);
}

export const supportsPassiveEvents: boolean = passiveOptionAccessed;

// not null && not undefined (is this a good impl, since we are using `!=`)
export function notNullish<T>(item: T | null | undefined): item is T {
  return item != null;
}

// determine if array
export function isArray<T>(arg: unknown): arg is readonly T[] {
  return Array.isArray(arg);
}

// ?? what is the meaning of this
export function valueTernary<Option, IsMulti extends boolean>(
  isMulti: IsMulti | undefined,
  multiValue: MultiValue<Option>,
  singleValue: SingleValue<Option>
): OnChangeValue<Option, IsMulti> {
  return (isMulti ? multiValue : singleValue) as OnChangeValue<Option, IsMulti>;
}

// ?? is this only for type change
export function singleValueAsValue<Option, IsMulti extends boolean>(
  singleValue: SingleValue<Option>
): OnChangeValue<Option, IsMulti> {
  return singleValue as OnChangeValue<Option, IsMulti>;
}

// ?? is this only for type change
export function multiValueAsValue<Option, IsMulti extends boolean>(
  multiValue: MultiValue<Option>
): OnChangeValue<Option, IsMulti> {
  return multiValue as OnChangeValue<Option, IsMulti>;
}

// remove keys from object by provided list of keys
// (param1: obj, param2: keys)
export const removeProps = <Props extends object, K extends string[]>(
  propsObj: Props,
  ...properties: K
): Omit<Props, K[number]> => {
  let propsMap = Object.entries(propsObj).filter(
    ([key]) => !properties.includes(key)
  );

  return propsMap.reduce((newProps: { [key: string]: any }, [key, val]) => {
    newProps[key] = val;
    return newProps;
  }, {}) as Omit<Props, K[number]>;
};
