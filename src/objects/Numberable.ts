import Arrayable from './Arrayable'
import * as NumberUtils from '../number'
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
        return NumberUtils.ordinal(this.valueOf())
    }

    /**
     * Fills up the number with zeroes.
     */
    pad(size: number) {
        return NumberUtils.pad(this.valueOf(), size)
    }

    /**
     * Executes callback for number of base values' times and returns a flooent array with the result of each iteration.
     */
    times<T = void>(callback: (index: number) => T[]) {
        return Arrayable.from(NumberUtils.times(this.valueOf(), callback))
    }

    /**
     * Check if the number is between two given numbers (Exclusive).
     */
    isBetween(start: number, end: number) {
        return NumberUtils.isBetween(this.valueOf(), start, end)
    }

    /**
     * Check if the number is between two given numbers (Inclusive).
     */
     isBetweenOr(start: number, end: number) {
        return NumberUtils.isBetweenOr(this.valueOf(), start, end)
    }

    /**
     * Rounds down until .4 and up from .5.
     */
    round() {
        return new this.constructor(NumberUtils.round(this.valueOf()))
    }

    /**
     * Always rounds its value up to the next largest whole number or integer.
     */
    ceil() {
        return new this.constructor(NumberUtils.ceil(this.valueOf()))
    }

    /**
     * Always rounds its value down.
     */
    floor() {
        return new this.constructor(NumberUtils.floor(this.valueOf()))
    }
}

export default Numberable
