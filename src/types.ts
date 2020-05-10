export type Constructor<T> = new(...args: any[]) => T
export type ObjectType<T = any, K = any> = Constructor<String> | Constructor<Array<T>> | Constructor<Number> | Constructor<Map<T, K>>
export type GivenValue<T = any, K = any> = T[] | number | string | Map<T, K> | T

export type CopyFunction<TFn, TR> = TFn extends (...a: infer A) => any ? (...a:A) => TR: never