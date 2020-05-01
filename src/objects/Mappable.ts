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

class Mappable<T = any, K = any> extends Map<T, K> {
  ["constructor"]!: typeof Mappable

  constructor(value: Map<T, K> | Object) {
    if (!(value instanceof Map) && !Array.isArray(value)) {
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
}

export default Mappable