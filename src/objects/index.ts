import Arrayable from './Arrayable'
import Stringable from './Stringable'
import Numberable from './Numberable'
import Mappable from './Mappable'

export { Arrayable, Stringable, Numberable, Mappable }

type Constructor<T> = new(...args: any[]) => T
export type ObjectType<T> = Constructor<String> | Constructor<Array<T>> | Constructor<Number> | Constructor<Map<any, any>>

export const typeMap = new Map<ObjectType<any>, any>([
    [String, Stringable],
    [Array, Arrayable],
    [Number, Numberable],
    [Map, Mappable],
])