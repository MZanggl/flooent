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

export { given, Stringable, Arrayable, Numberable }
