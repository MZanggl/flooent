class Arrayable extends Array {
  static times(length, fn) {
    return this.from({ length }, (value, i) => fn(i))
  }

  first() {
    return this.length > 0 ? this[0] : undefined
  }
  
  last() {
    return this.length > 0 ? this[this.length - 1] : undefined
  }

  pluck(key) {
    return this.map(item => item[key])
  }
}

export default Arrayable
