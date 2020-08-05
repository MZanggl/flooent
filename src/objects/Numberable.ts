import Arrayable from './Arrayable'

class Numberable extends Number {
    ["constructor"]!: typeof Numberable

    private _isPercent: boolean
    constructor(number, options: any = {}) {
        super(number)

        const { isPercent = false } = options
        this._isPercent = isPercent
    }

    /**
     * Used as part of percent equations. Examples:
     * given.number(40).percent().of(750) // Number { 300 }
     * given.number(300).of(750).inPercent() // Number { 40 }
     */
    of(number: number) {
        if (this._isPercent) {
            return new this.constructor((this as any) * number)
        }
        return new this.constructor((this as any) / number)
    }

    /**
     * Used as part of an equation `given.number(40).percent().of(750) // Number { 300 }`
     */
    percent() {
        return new this.constructor((this as any) / 100, { isPercent: true })
    }

    /**
     * Used as part of an equation `given.number(300).of(750).inPercent() // Number { 40 }`
     */
    inPercent() {
        return new this.constructor((this as any) * 100)
    }

    /**
     * Returns number with ordinal suffix. Only supports English.
     */
    ordinal() {
        const finalDigit = this.toString().slice(-1)
        return this.toString() + (["th", "st", "nd", "rd"][finalDigit] || "th")
    }

    /**
     * Fills up the number with zeroes.
     */
    pad(size: number) {
        let value = this.toString()
        while (value.length < size) value = "0" + value
        return value
    }

    /**
     * Executes callback for number of base values' times and returns a flooent array with the result of each iteration.
     */
    times<T = void>(callback: (index: number) => T[]) {
        return Arrayable.from({ length: (this as unknown) as number }, (value, i) => callback(i))
    }

    /**
     * Check if the number is between two given numbers (Exclusive).
     */
    isBetween(start, end) {
        return this > start && this < end
    }

    /**
     * Check if the number is between two given numbers (Inclusive).
     */
    isBetweenOr(start, end) {
        return this >= start && this <= end
    }

    /**
     * Rounds down until .4 and up from .5.
     */
    round() {
        return new this.constructor(Math.round((this as unknown) as number))
    }

    /**
     * Always rounds its value up to the next largest whole number or integer.
     */
    ceil() {
        return new this.constructor(Math.ceil((this as unknown) as number))
    }

    /**
     * Always rounds its value down.
     */
    floor() {
        return new this.constructor(Math.floor((this as unknown) as number))
    }
}

export default Numberable
