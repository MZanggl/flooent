import { Stringable, Arrayable, Numberable } from './objects'

type AnyValue = any[] | number | string
type Callback = (result: any) => any

function given(anyValue: AnyValue, callback?: Callback) {
    let result
    if (Array.isArray(anyValue)) {
        result = Arrayable.from(anyValue)
    } else if (typeof anyValue === "number") {
        result = new Numberable(anyValue)
    } else {
        result = new Stringable(anyValue)
    }

    if (!callback) {
        return result
    }

    const callbackResult = callback(result)
    if (callbackResult instanceof Stringable || callbackResult instanceof Numberable) {
        return callbackResult.valueOf()
    }

    return callbackResult
}

type Constructor<T> = new(...args: any[]) => T
type ObjectType<T> = Constructor<String> | Constructor<Array<T>> | Constructor<Number>

const typeMap = new Map<ObjectType<any>, any>([
    [String, Stringable],
    [Array, Arrayable],
    [Number, Numberable],
])
given.macro = function<T = unknown>(type: ObjectType<T>, key: string, callback: Function) {
    // @ts-ignore
    typeMap.get(type).prototype[key] = callback
}

export { given, Stringable, Arrayable, Numberable }
