import fromEntries from 'fromentries'
import { Arrayable } from './index'

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

  mapKeys<N>(callback: ((value: V, key: K) => N)) {
    return this
      .entries()
      .map(([key, value]) => [callback(value, key), value])
        // @ts-ignore
      .toMap()
  }

  mapValues<N>(callback: ((value: V, key: K) => N)) {
    return this
      .entries()
      .map(([key, value]) => [key, callback(value, key)])
        // @ts-ignore
      .toMap()
  }

  clone() {
    return this.entries().clone().toMap()
  }

  arrange(...keys: K[]) {
    const clone = this.clone()
    const entries = keys.map(key => [key, clone.pull(key)])
    return new this.constructor(entries.concat(clone.entries()))
  }

  pull(key?: any) {
    const value = this.get(key)
    this.delete(key)
    return value
  }

  only(keys: K[]) {
    return this.entries().filter(([key, value]) => keys.indexOf(key) >= 0).toMap()
  }
  
  except(keys: K[]) {
    return this.entries().filter(([key, value]) => keys.indexOf(key) === -1).toMap()
  }
}

export default Mappable