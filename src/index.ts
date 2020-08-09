import Arrayable from "./objects/Arrayable"
import Stringable from "./objects/Stringable"
import Numberable from "./objects/Numberable"
import Mappable from "./objects/Mappable"
import Any from "./objects/Any"
import { MapValue } from './types'

type Callback<T> = (result: T) => any

/**
 * Create a flooent string. You have access to [everything from the native String object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
 */
function string(value: string): Stringable
function string(value: string, callback: Callback<Stringable>): string
function string(value: string, callback?: Callback<Stringable>) {
    const result = new Stringable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return callbackResult instanceof Stringable ? callbackResult.valueOf() : callbackResult
}
string.macro = (key: string, callback: Function) => (Stringable.prototype[key] = callback)

/**
 * Create a flooent number. You have access to [everything from the native Number object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
 */
function number(value: number): Numberable
function number(value: number, callback: Callback<Numberable>): number
function number(value: number, callback?: Callback<Numberable>) {
    const result = new Numberable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return callbackResult instanceof Numberable ? callbackResult.valueOf() : callbackResult
}
number.macro = (key: string, callback: Function) => (Numberable.prototype[key] = callback)

/**
 * Create a flooent array. You have access to [everything from the native Array object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
 */
const array = <T>(value: T[]) => Arrayable.from<T>(value)
array.macro = (key: string, callback: Function) => (Arrayable.prototype[key] = callback)

/**
 * Create a flooent map. You have access to [everything from the native Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
 */
const map = <K, V>(value: MapValue<K, V>) => new Mappable<K, V>(value)
map.macro = (key: string, callback: Function) => (Mappable.prototype[key] = callback)

/**
 * A generic helper class for any kind of data types.
 */
const any = <T>(value: T) => new Any(value)
any.macro = (key: string, callback: Function) => (Any.prototype[key] = callback)

const given = { string, number, array, map, any }
export { Stringable, Arrayable, Numberable, Mappable, given, Any }
