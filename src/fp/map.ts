import * as map from "../map";
import { createFpFunctions } from '.'

export { pipe } from '.'

const fp = createFpFunctions(map, new Map)

export let {
  /* Build list */toObject, mapKeys, rename, mapValues, arrange, pull, only, except, toEntries, toJSON/* end */
} = fp;