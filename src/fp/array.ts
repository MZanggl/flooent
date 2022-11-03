import * as array from "../array";
import { createFpFunctions } from '.'

export { pipe } from '.'

const fp = createFpFunctions(array, [])

export let {
  /* Build list */first, second, last, isEmpty, nth, until, reject, move, chunk, forPage, pad, point, where, whereNot, whereIn, whereNotIn, filled, mutate, groupBy, keyBy, sum, omit, pluck, unique, shuffle, partition, prepend, append, sortDesc, sortAsc, toMap, toKeyedMap, at/* end */
} = fp;