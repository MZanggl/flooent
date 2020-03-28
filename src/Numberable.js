class Numberable extends Number {
  constructor(number, op) {
    super(number)

    if (op === '%') {
      this.totalOf = fraction => new this.constructor(100 / this * fraction)
      this.fractionOf = total => new this.constructor(this / 100 * total)
    } else {
      this.percentOf = total => new this.constructor(this / total * 100)
    }
  }

  map(callback) {
    return Array.from({ length: this }, (value, i) => callback(i))
  }

  forEach(callback) {
    Array.from({ length: this }).forEach(callback)
    return this
  }
}

export default Numberable;
