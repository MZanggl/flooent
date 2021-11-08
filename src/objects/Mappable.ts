import Arrayable from './Arrayable'
import * as MapUtils from '../map'

class Mappable<K = any, V = any> extends Map<K, V> {
  ["constructor"]!: typeof Mappable

  constructor(value?: Map<K, V> | Object) {
    if (value && !(value instanceof Map) && !Array.isArray(value)) {
      value = MapUtils.toEntries(value)
    }

    // @ts-ignore
    super(value)
  }

  /**
     * Returns a raw map
    */
   valueOf() {
    return new Map(this)
  }
  
  /**
   * Turns the map into an object.
   */
  toJSON() {
    return MapUtils.toJSON(this)
  }

  entries() {
    return Arrayable.from(super.entries())
  }

  keys() {
    return Arrayable.from(super.keys())
  }

  values() {
    return Arrayable.from(super.values())
  }

  /**
   * Iterates the entries through the given callback and assigns each result as the key.
   */
  mapKeys<N>(callback: ((value: V, key: K) => N)) {
    return new this.constructor(MapUtils.mapKeys(this, callback))
  }

  /**
   * Renames the given key with the new key if found, keeping the original insertion order.
   */
  rename(oldKey: K, newKey: K) {
    return new this.constructor(MapUtils.rename(this, oldKey, newKey))
  }

  /**
   * Iterates the entries through the given callback and assigns each result as the value.
   */
  mapValues<N>(callback: ((value: V, key: K) => N)) {
    return new this.constructor(MapUtils.mapValues(this, callback))
  }

  /**
   * Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.
   */
  arrange(...keys: K[]) {
    return new this.constructor(MapUtils.arrange<K, V>(this, ...keys))
  }

  /**
   * Returns the value for the given key and deletes the key value pair from the map (mutation).
   */
  pull(key: any) {
    return MapUtils.pull<K, V>(this, key)
  }

  /**
   * Returns a new map with only the given keys.
   */
  only(keys: K[]) {
    return new this.constructor(MapUtils.only(this, keys)) as Mappable<K, V>
  }
  
  /**
   * Inverse of `only`. Returns a new map with all keys except for the given keys.
   */
  except(keys: K[]) {
    return new this.constructor(MapUtils.except(this, keys)) as Mappable<K, V>
  }
}

export default Mappable