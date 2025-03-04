import Arrayable from './Arrayable'
import Stringable from './Stringable'
import {
  toObject,
  mapKeys,
  rename,
  mapValues,
  arrange,
  pull,
  only,
  except,
} from '../map'
import { toEntries } from '../object'
import { MapValue } from '../types'

class Mappable<K = any, V = any> extends Map<K, V> {
  ["constructor"]!: typeof Mappable

  constructor(value?: MapValue<K, V>) {
    super(value)
  }

  static fromObject<K extends string, V = any> (value: Record<K, V>) {
    const entries = toEntries(value)
    return new this<K, V>(entries)
  }

  /**
     * Executes callback and transforms result back into a flooent map if it is a map.
     */
  pipe(callback: (value: Mappable<K, V>) => Mappable<K, V>): Mappable<K, V>
  pipe<P>(callback: (value: Mappable<K, V>) => P): P
  pipe(callback) {
      const result = callback(this)
      return result instanceof Map ? new this.constructor<K, V>(result) : result
  }

  /**
   * Executes callback if first given value evaluates to true. Result will get transformed back into a flooent array if it is an array.
   */
  when<P>(comparison, then: ((value: Mappable<K, V>) => P)) {
      const isBoolean = typeof comparison === "boolean"

      if (isBoolean && !comparison) {
          return this
      }

      if (!isBoolean && !comparison(this)) {
          return this
      }

      return this.pipe(then)
  }

  /**
     * Returns a raw map
    */
  valueOf() {
    const values = this.toValues()
    if (values[0] instanceof Arrayable || values[0] instanceof Mappable || values[0] instanceof Stringable) {
      return new Map(this.mapValues(item => item?.valueOf?.() ?? item))
    }
    return new Map(this)
  }

  /**
  * Turns the map into an object. Useful for implicit transformations via JSON.stringify().
  * Use toObject for explicit object transformations.
  */
  toJSON() {
    return toObject(this)
  }
  
  /**
   * Turns the map into an object.
   */
  toObject() {
    return toObject(this)
  }

  toEntries() {
    return Arrayable.from(super.entries())
  }

  toKeys() {
    return Arrayable.from(super.keys())
  }

  toValues() {
    return Arrayable.from(super.values())
  }
  
  /**
   * Iterates the entries through the given callback and assigns each result as the key.
   */
  mapKeys<N>(callback: ((value: V, key: K, index: number) => N)) {
    return new this.constructor<N, V>(mapKeys(this, callback))
  }

  /**
   * Renames the given key with the new key if found, keeping the original insertion order.
   */
  rename(oldKey: K, newKey: K) {
    return new this.constructor(rename(this, oldKey, newKey))
  }

  /**
   * Iterates the entries through the given callback and assigns each result as the value.
   */
  mapValues<N>(callback: ((value: V, key: K, index: number) => N)) {
    return new this.constructor(mapValues(this, callback))
  }

  /**
   * Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.
   */
  arrange(...keys: K[]) {
    return new this.constructor(arrange<K, V>(this, ...keys))
  }

  /**
   * Returns the value for the given key and deletes the key value pair from the map (mutation).
   */
  pull(key: any) {
    return pull<K, V>(this, key)
  }

  /**
   * Returns a new map with only the given keys.
   */
  only(keys: K[]) {
    return new this.constructor(only(this, keys)) as Mappable<K, V>
  }
  
  /**
   * Inverse of `only`. Returns a new map with all keys except for the given keys.
   */
  except(keys: K[]) {
    return new this.constructor(except(this, keys)) as Mappable<K, V>
  }
}

export default Mappable