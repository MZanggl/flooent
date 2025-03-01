type Key = string | number | symbol

/**
 * Iterates the entries through the given callback and assigns each result as the key.
 */
export function mapKeys<K extends Key, V, N>(value: Record<K, V>, callback: ((value: V, key: K, index: number) => N)): Record<string, N> {
  const entries = Object.entries(value) as [K, V][]
  const mapped = entries.map(([key, value], index) => [callback(value, key, index), value])
  return Object.fromEntries(mapped)
}

/**
 * Iterates the entries through the given callback and assigns each result as the value.
 */
export function mapValues<K extends Key, V, N>(value: Record<K, V>, callback: ((value: V, key: K, index: number) => N)): Record<K, N> {
  const entries = Object.entries(value) as [K, V][]
  const mapped = entries.map(([key, value], index) => [key, callback(value, key, index)])
  return Object.fromEntries(mapped) as Record<K, N>
}

export function rename<K extends Key, V>(value: Record<K, V>, oldKey: K, newKey: K) {
  return mapKeys(value, (_, key) => {
    return (key as string === oldKey as string) ? newKey : key
  })
}

export function pull<K extends Key, V>(value: Record<K, V>, key: K) {
  const pulled = value[key]
  delete value[key]
  return pulled
}

export function only<K extends Key, V>(value: Record<K, V>, keys: K[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => (keys as string[]).includes(key as string)))
}

/**
 * Inverse of `only`. Returns a new map with all keys except for the given keys.
 */
export function except<K extends Key, V>(value: Record<K, V>, keys: K[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !(keys as string[]).includes(key as string)))
}

export function toEntries<K extends Key, V = any>(obj: Record<K, V>) {
  let ownProps = Object.keys(obj)
  let i = ownProps.length
  let resArray = new Array(i); // preallocate the Array

  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  
  return resArray as [K, V][];
}

export function toMap<K extends Key, V>(obj: Record<K, V>) {
  const entries = toEntries(obj)
  return new Map<K, V>(entries)
}