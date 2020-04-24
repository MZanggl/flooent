class Numberable extends Number {
  private _isPercent: boolean
  constructor(number, options: any = {}) {
    super(number)

    const { isPercent = false } = options
    this._isPercent = isPercent
  }

  of(number) {
    if (this._isPercent) {
      return new (this as any).constructor(this as any * number)
    }
    return new (this as any).constructor(this as any / number)
  }

  percent() {
    return new (this as any).constructor(this as any / 100, { isPercent: true })
  }

  inPercent() {
    return new (this as any).constructor(this as any * 100)
  }

  ordinal() {
    const finalDigit = this.toString().slice(-1)
    return this + (['th', 'st', 'nd', 'rd'][finalDigit] || 'th')
  }

  pad(size) {
    let value = this.toString()
    while (value.length < size) value = "0" + value;
    return value
  }

  times(callback) {
    return Array.from({ length: this as unknown as number }, (value, i) => callback(i))
  }

  isBetween(start, end) {
    return this > start && this < end
  }

  isBetweenOr(start, end) {
    return this >= start && this <= end
  }

  round() {
    return new (this as any).constructor(Math.round(this as unknown as number))
  }

  ceil() {
    return new (this as any).constructor(Math.ceil(this as unknown as number))
  }

  floor() {
    return new (this as any).constructor(Math.floor(this as unknown as number))
  }

  max(...compare) {
    return new (this as any).constructor(Math.max(this as unknown as number, ...compare))
  }

  min(...compare) {
    return new (this as any).constructor(Math.min(this as unknown as number, ...compare))
  }
}

export default Numberable;
