import { Arrayable } from '../index'

class Numberable extends Number {
    ["constructor"]!: typeof Numberable

    private _isPercent: boolean
    constructor(number, options: any = {}) {
        super(number)

        const { isPercent = false } = options
        this._isPercent = isPercent
    }

    of(number: number) {
        if (this._isPercent) {
            return new this.constructor((this as any) * number)
        }
        return new this.constructor((this as any) / number)
    }

    percent() {
        return new this.constructor((this as any) / 100, { isPercent: true })
    }

    inPercent() {
        return new this.constructor((this as any) * 100)
    }

    ordinal() {
        const finalDigit = this.toString().slice(-1)
        return this.toString() + (["th", "st", "nd", "rd"][finalDigit] || "th")
    }

    pad(size: number) {
        let value = this.toString()
        while (value.length < size) value = "0" + value
        return value
    }

    times<T = void>(callback: (index: number) => T[]) {
        return Arrayable.from({ length: (this as unknown) as number }, (value, i) => callback(i))
    }

    isBetween(start, end) {
        return this > start && this < end
    }

    isBetweenOr(start, end) {
        return this >= start && this <= end
    }

    round() {
        return new this.constructor(Math.round((this as unknown) as number))
    }

    ceil() {
        return new this.constructor(Math.ceil((this as unknown) as number))
    }

    floor() {
        return new this.constructor(Math.floor((this as unknown) as number))
    }
}

export default Numberable
