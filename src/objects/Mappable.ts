import fromEntries from 'fromentries'
import Arrayable from './Arrayable'

function entries(obj) {
  var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  
  return resArray;
}

class Mappable<K = any, V = any> extends Map<K, V> {
  ["constructor"]!: typeof Mappable

  constructor(value?: Map<K, V> | Object) {
    if (value && !(value instanceof Map) && !Array.isArray(value)) {
      value = entries(value)
    }

    // @ts-ignore
    super(value)
  }
  
  /**
   * Turns the map into an object.
   */
  toJSON() {
    return fromEntries(this.entries())
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
    return this
      .entries()
      .map(([key, value]) => [callback(value, key), value])
        // @ts-ignore
      .toMap()
  }

  /**
   * Iterates the entries through the given callback and assigns each result as the value.
   */
  mapValues<N>(callback: ((value: V, key: K) => N)) {
    return this
      .entries()
      .map(([key, value]) => [key, callback(value, key)])
        // @ts-ignore
      .toMap()
  }

  /**
   * Deep clones a map.
   */
  clone() {
    return this.entries().clone().toMap()
  }

  /**
   * Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.
   */
  arrange(...keys: K[]) {
    const clone = this.clone()
    const entries = keys.map(key => [key, clone.pull(key)])
    return new this.constructor(entries.concat(clone.entries()))
  }

  /**
   * Returns the value for the given key and deletes the key value pair from the map (mutation).
   */
  pull(key?: any) {
    const value = this.get(key)
    this.delete(key)
    return value
  }

  /**
   * Returns a new map with only the given keys.
   */
  only(keys: K[]) {
    return this.entries().filter(([key]) => keys.indexOf(key) >= 0).toMap()
  }
  
  /**
   * Inverse of `only`. Returns a new map with all keys except for the given keys.
   */
  except(keys: K[]) {
    return this.entries().filter(([key]) => keys.indexOf(key) === -1).toMap()
  }
}

export default Mappable