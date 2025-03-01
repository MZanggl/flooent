/**
 * Turns the map into an object.
 */
export function toObject<K, V>(value: Map<K, V>) {
  const obj = {}
  value.forEach((value, key) => obj[key as unknown as string] = value)
  return obj
}

/**
 * Iterates the entries through the given callback and assigns each result as the key.
 */
export function mapKeys<K, V, N>(value: Map<K, V>, callback: ((value: V, key: K, index: number) => N)): Map<N, V> {
  const entries =  [...value.entries()]
  const mapped = entries.map(([key, value], index) => [callback(value, key, index), value]) as any
  return new Map<N, V>(mapped)
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
export function mapValues<K, V, N>(value: Map<K, V>, callback: ((value: V, key: K, index: number) => N)): Map<K, N> {
  const entries = [...value.entries()]
  const mapped = entries.map(([key, value], index) => [key, callback(value, key, index)]) as any
  return new Map<K, N>(mapped)
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
