/**
 * Turns the map into an object.
 */
export function toJSON<K, V>(value: Map<K, V>) {
  const obj = {}
  value.forEach((value, key) => obj[key as unknown as string] = value)
  return obj
}

/**
 * Iterates the entries through the given callback and assigns each result as the key.
 */
export function mapKeys<K, V, N>(value: Map<K, V>, callback: ((value: V, key: K) => N)) {
  return new Map<N, V>([...value.entries()].map(([key, value]) => [callback(value, key), value]) as any)
}

/**
 * Renames the given key with the new key if found, keeping the original insertion order.
 */
export function rename<K, V>(value: Map<K, V>, oldKey: K, newKey: K) {
  return mapKeys(value, (_, key) => {
    return (key === oldKey) ? newKey : key
  })
}

/**
 * Iterates the entries through the given callback and assigns each result as the value.
 */
export function mapValues<K, V, N>(value: Map<K, V>, callback: ((value: V, key: K) => N)) {
  return new Map<K, N>([...value.entries()].map(([key, value]) => [key, callback(value, key)]) as any)
}

/**
 * Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.
 */
export function arrange<K, V>(value: Map<K, V>, ...keys: K[]) {
  const rest = new Map(value)
  const entries = keys.map(key => {
    const value = pull(rest, key)
    return [key, value]
  })
  return new Map<K, V>(entries.concat([...rest.entries()]) as any)
}

/**
 * Returns the value for the given key and deletes the key value pair from the map (mutation).
 */
export function pull<K, V>(value: Map<K, V>, key: any) {
  const pulled = value.get(key)
  value.delete(key)
  return pulled
}

/**
 * Returns a new map with only the given keys.
 */
export function only<K, V>(value: Map<K, V>, keys: K[]) {
  return new Map<K, V>([...value.entries()].filter(([key]) => keys.indexOf(key) >= 0))
}

/**
 * Inverse of `only`. Returns a new map with all keys except for the given keys.
 */
export function except<K, V>(value: Map<K, V>, keys: K[]) {
  return new Map<K, V>([...value.entries()].filter(([key]) => keys.indexOf(key) === -1))
}

export function toEntries(obj: Object) {
  let ownProps = Object.keys(obj)
  let i = ownProps.length
  let resArray = new Array(i); // preallocate the Array

  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  
  return resArray;
}