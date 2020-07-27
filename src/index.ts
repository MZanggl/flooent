import { Stringable, Arrayable, Numberable, Mappable } from './objects'

type Callback<T> = (result: T) => any

function givenString(value: string): Stringable;
function givenString(value: string, callback: Callback<Stringable>): string;
function givenString(value: string, callback?: Callback<Stringable>) {
    const result = new Stringable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return (callbackResult instanceof Stringable) ? callbackResult.valueOf() : callbackResult
}
givenString.macro = (key: string, callback: Function) => Stringable.prototype[key] = callback

function givenNumber(value: number): Numberable;
function givenNumber(value: number, callback: Callback<Numberable>): number;
function givenNumber(value: number, callback?: Callback<Numberable>) {
    const result = new Numberable(value)
    if (!callback) return result
    const callbackResult = callback(result)
    return (callbackResult instanceof Numberable) ? callbackResult.valueOf() : callbackResult
}
givenNumber.macro = (key: string, callback: Function) => Numberable.prototype[key] = callback

const givenArray = <T>(value: T[]) => Arrayable.from<T>(value)
givenArray.macro = (key: string, callback: Function) => Arrayable.prototype[key] = callback

const givenMap = <K, V>(value) => new Mappable<K, V>(value)
givenMap.macro = (key: string, callback: Function) => Mappable.prototype[key] = callback

export { Stringable, Arrayable, Numberable, Mappable, givenString, givenArray, givenNumber, givenMap }
