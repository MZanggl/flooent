import Arrayable from "./objects/Arrayable"
import Stringable from "./objects/Stringable"
import Mappable from "./objects/Mappable"
import { MapValue } from './types'
import { sized } from './array'

/**
 * Create a flooent string. You have access to [everything from the native String object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
 */
function string(value: string) {
    return new Stringable(value)
}
string.macro = (key: string, callback: Function) => (Stringable.prototype[key] = callback)

const array = <T>(value: T[]) => Arrayable.from<T>(value)
array.macro = (key: string, callback: Function) => (Arrayable.prototype[key] = callback)

/**
 * Executes callback for number of base values' times and returns a flooent array with the result of each iteration.
 */
array.sized = Arrayable.sized.bind(Arrayable)

/**
 * Create a flooent map. You have access to [everything from the native Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
 */
const map = <K, V>(value: MapValue<K, V>) => new Mappable<K, V>(value)
map.macro = (key: string, callback: Function) => (Mappable.prototype[key] = callback)

/**
 * Create a map from an object
 */
map.fromObject = Mappable.fromObject.bind(Mappable)

const given = { string, array, map }
export { Stringable, Arrayable, Mappable, given }
