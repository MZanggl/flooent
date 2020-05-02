import Arrayable from './Arrayable'
import Stringable from './Stringable'
import Numberable from './Numberable'
import Mappable from './Mappable'
import { ObjectType, GivenValue } from '../types'

export { Arrayable, Stringable, Numberable, Mappable }

export const typeMap = new Map<ObjectType<any>, any>([
    [String, Stringable],
    [Array, Arrayable],
    [Number, Numberable],
    [Map, Mappable],
])

export function newupGivenValue<T, K>(value: GivenValue<T, K>) {
    if (typeof value === "number") {
        return new Numberable(value)
    }

    if (typeof value === "string") {
        return new Stringable(value)
    }

    if (Symbol.iterator in value && !(value instanceof Map)) {
        return Arrayable.from<T>(value as Iterable<T>)
    } 


    if (typeof value === 'object') {
        return new Mappable<T, K>(value)
    }
}