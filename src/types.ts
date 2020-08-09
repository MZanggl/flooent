export type Constructor<T> = new(...args: any[]) => T

export type CopyFunction<TFn, TR> = TFn extends (...a: infer A) => any ? (...a:A) => TR: never

export type MapValue<K, V> = { [key: string]: V } | Map<K, V> | [K, V][]