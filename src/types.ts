export type Constructor<T> = new(...args: any[]) => T

export type CopyFunction<TFn, TR> = TFn extends (...a: infer A) => any ? (...a:A) => TR: never

export type MapValue<K, V> = Map<K, V> | [K, V][]

export interface ArrayConstructor<T> extends Function {
  from: (value: T[]) => T[]
}