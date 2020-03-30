class Numberable extends Number {
  constructor(number, options = {}) {
    super(number)

    const { isPercent = false } = options
    this._isPercent = isPercent
  }

  of(number) {
    if (this._isPercent) {
      return new this.constructor(this * number)
    }
    return new this.constructor(this / number)
  }

  percent() {
    return new this.constructor(this / 100, { isPercent: true })
  }

  inPercent() {
    return new this.constructor(this * 100)
  }

  times(callback) {
    return Array.from({ length: this }, (value, i) => callback(i))
  }

  round() {
    return new this.constructor(Math.round(this))
  }

  ceil() {
    return new this.constructor(Math.ceil(this))
  }

  floor() {
    return new this.constructor(Math.floor(this))
  }

  max(...compare) {
    return new this.constructor(Math.max(this, ...compare))
  }

  min(...compare) {
    return new this.constructor(Math.min(this, ...compare))
  }
}

export default Numberable;
