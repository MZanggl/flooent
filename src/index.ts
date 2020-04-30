import { Stringable, Arrayable, Numberable, Mappable, ObjectType, typeMap } from './objects'

type AnyValue = any[] | number | string | Map<any, any> | Object
type Callback = (result: any) => any

function given(anyValue: AnyValue, callback?: Callback) {
    let result
    if (Array.isArray(anyValue)) {
        result = Arrayable.from(anyValue)
    } else if (typeof anyValue === "number") {
        result = new Numberable(anyValue)
    } else if (typeof anyValue === 'object') {
        result = new Mappable(anyValue)
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

given.macro = function<T = unknown>(type: ObjectType<T>, key: string, callback: Function) {
    // @ts-ignore
    typeMap.get(type).prototype[key] = callback
}

export { given, Stringable, Arrayable, Numberable, Mappable }
