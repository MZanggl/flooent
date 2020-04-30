import fromEntries from 'fromentries'

function entries(obj) {
  var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  
  return resArray;
}

class Mappable extends Map {
  ["constructor"]!: typeof Mappable

  constructor(value: Map<any, any> | Object) {
    if (!(value instanceof Map)) {
      value = entries(value)
    }


    // @ts-ignore
    super(value)
  }
  
  toJSON() {
    return fromEntries(this.entries())
  }
}

export default Mappable