import Arrayable from './objects/Arrayable'
import Stringable from './objects/Stringable'
import Numberable from './objects/Numberable'
import Mappable from './objects/Mappable'

type Callback<T> = (result: T) => any

function string(value: string): Stringable
function string(value: string, callback: Callback<Stringable>): string
function string(value: string, callback?: Callback<Stringable>) {
    const result = new Stringable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return (callbackResult instanceof Stringable) ? callbackResult.valueOf() : callbackResult
}
string.macro = (key: string, callback: Function) => Stringable.prototype[key] = callback

function number(value: number): Numberable
function number(value: number, callback: Callback<Numberable>): number
function number(value: number, callback?: Callback<Numberable>) {
    const result = new Numberable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return (callbackResult instanceof Numberable) ? callbackResult.valueOf() : callbackResult
}
number.macro = (key: string, callback: Function) => Numberable.prototype[key] = callback

const array = <T>(value: T[]) => Arrayable.from<T>(value)
array.macro = (key: string, callback: Function) => Arrayable.prototype[key] = callback

const map = <K, V>(value) => new Mappable<K, V>(value)
map.macro = (key: string, callback: Function) => Mappable.prototype[key] = callback

const given = { string, number, array, map }
export { Stringable, Arrayable, Numberable, Mappable, given }
