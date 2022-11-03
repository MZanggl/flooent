import { given } from '..'

export const pipe = <T>(value: T, ...pipes: (Function & { $isFlooent?: true })[]) => {
  return pipes.reduce((result, pipe) => {
    if (pipe.$isFlooent) {
      pipe = pipe()
    }
    return pipe(result)
  }, value) as T
}

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type TurnFunctionIntoFP<RT, T> = {[K in keyof T]: ReplaceReturnType<OmitFirstArg<T[K]>, (value: RT) => RT> };


export const createFpFunctions = <T extends { [key: string]: Function; }, RT>(object: T, returnType: RT) => {
  return given.map(object).mapValues(fn => {
    const pipable = (...args: [never]) => (value) => fn(value, ...args)
    pipable.$isFlooent = true
    return pipable
  }).toObject() as TurnFunctionIntoFP<RT, T>
}

const commonlyIgnoredNames = ['constructor', 'valueOf', 'length']
export const createFpFunctionsFromPrimitive = <T>(object: T, ignoredNames) => {
  ignoredNames = [...ignoredNames, ...commonlyIgnoredNames]
  const keys = Object.getOwnPropertyNames((object as any).__proto__).filter(name => ignoredNames.indexOf(name) === -1)
  const functions = {}

  keys.forEach(key => {
    functions[key] = (...args: [never]) => (value) => value[key](...args)
  })

  return functions as TurnFunctionIntoFP<T, string>
}