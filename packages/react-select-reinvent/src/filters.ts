import memoizeOne from "memoize-one";
import { stripDiacritics } from "./diacritics";

// label, value + custom data
export interface FilterOptionOption<Option> {
  readonly label: string;
  // all value considered as string (even looks like number)
  readonly value: string;
  readonly data: Option;
}

// filter logic configuration
interface Config<Option> {
  // should A be same as a, if ignoreCase === true, search A, a will be as hit as well
  readonly ignoreCase?: boolean;
  // should apply stripDiacritics, i.e., if accents ignored, apply stripDiatrictis
  readonly ignoreAccents?: boolean;
  // stringify of one option
  readonly stringify?: (option: FilterOptionOption<Option>) => string;
  // should trim both sides spaces?
  readonly trim?: boolean;
  // should match from start of any position matching
  readonly matchFrom?: "any" | "start";
}

// ?? what is the meaning of memoizeOne
const memoizedStripDiacriticsForInput = memoizeOne(stripDiacritics);

// replace starting space and ending space with empty string
const trimString = (str: string) => str.replace(/^\s+|\s+$/g, "");

// default stringify: option => `${label} ${value}`
const defaultStringify = <Option>(option: FilterOptionOption<Option>) =>
  `${option.label} ${option.value}`;

// createFilter returns a func
export const createFilter =
  <Option>(config?: Config<Option>) =>
  (option: FilterOptionOption<Option>, rawInput: string): boolean => {
    // ?? why __isNew__ return true
    // eslint-disable-next-line no-underscore-dangle
    if ((option.data as { __isNew__?: unknown }).__isNew__) return true;
    // filter logic settings from config
    const { ignoreCase, ignoreAccents, stringify, trim, matchFrom } = {
      // default settings
      ignoreCase: true,
      ignoreAccents: true,
      stringify: defaultStringify,
      trim: true,
      matchFrom: "any",
      // overriding settings
      ...config,
    };
    // trim rawInput if possible
    let input = trim ? trimString(rawInput) : rawInput;
    // trim option as well as candidate for next logic
    let candidate = trim ? trimString(stringify(option)) : stringify(option);
    // if ignoreCase, both lower case for next logic
    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }
    // if ignoreAccents, strip diacritics for both
    if (ignoreAccents) {
      input = memoizedStripDiacriticsForInput(input);
      candidate = stripDiacritics(candidate);
    }

    return matchFrom === "start"
      ? // if "start", only match cadidate's start string with input
        candidate.substr(0, input.length) === input
      : // if elsewhere "any", use indexOf to find any position's matching
        candidate.indexOf(input) > -1;
  };
