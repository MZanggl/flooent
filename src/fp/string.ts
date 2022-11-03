import * as string from "../string";
import { createFpFunctions, createFpFunctionsFromPrimitive } from '.'

export { pipe } from '.'

const fp = createFpFunctions(string, '')

export let {
  /* Build list */after, afterLast, before, beforeLast, wrap, unwrap, append, prepend, includedIn, endWith, startWith, limit, title, kebab, snake, studly, camel, capitalize, slug, parse/* end */
} = fp