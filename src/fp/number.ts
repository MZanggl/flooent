import * as number from "../number";
import { createFpFunctions } from '.'

export { pipe } from '.'

const fp = createFpFunctions(number, 0)

export let {
  /* Build list */ordinal, pad, times, isBetween, isBetweenOr, round, ceil, floor/* end */
} = fp;