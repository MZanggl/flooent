import { Stringable, Arrayable, Numberable, Mappable, typeMap, newupGivenValue } from './objects'
import { ObjectType, GivenValue } from './types'

type Callback = (result: any) => any

/**
 * Create either a flooent Number, Array, Map, or String depending on its type.
 * To create a flooent Map, either pass in a native Map, or an object.
 */
function given(value: string): Stringable
function given<T>(value: T[]): Arrayable<T>
function given(value: number): Numberable
function given<T = any, K = any>(value: Map<T, K>): Mappable<T, K>
function given<T = any, K = any>(value: Object): Mappable<T, K>
function given<T = any, K = any>(givenValue: GivenValue<T, K>, callback?: Callback) {
    const result = newupGivenValue<T, K>(givenValue)

    if (!callback) {
        return result
    }

    const callbackResult = callback(result)
    if (callbackResult instanceof Stringable || callbackResult instanceof Numberable) {
        return callbackResult.valueOf()
    }

    return callbackResult
}

/**
 * Extend flooent's native functionality.
 */
given.macro = function<T = unknown>(type: ObjectType<T>, key: string, callback: Function) {
    // @ts-ignore
    typeMap.get(type).prototype[key] = callback
}

export { given, Stringable, Arrayable, Numberable, Mappable }
