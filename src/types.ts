export type Constructor<T> = new(...args: any[]) => T

export type CopyFunction<TFn, TR> = TFn extends (...a: infer A) => any ? (...a:A) => TR: never