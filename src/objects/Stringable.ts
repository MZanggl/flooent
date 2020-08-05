import startcase from "lodash.startcase"
import slugify from "slugify"

const override = [
    "replace",
    "replaceAll",
    "trim",
    "trimEnd",
    "trimStart",
    "substr",
    "substring",
    "concat",
    "repeat",
    "slice",
    "toLocaleLowerCase",
    "toLocaleUpperCase",
    "toLowerCase",
    "toUpperCase",
    "charAt",
    "charCodeAt",
]

class Stringable extends String {
    ["constructor"]!: typeof Stringable

    constructor(value) {
        super(value)

        override.forEach((name) => {
            this[name] = (...args) => {
                return new this.constructor(super[name](...args))
            }
        })
    }

    /**
     * Returns the remaining text after the first occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    after(part: string) {
        const index = this.indexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(index + part.length) as unknown) as Stringable
    }

    /**
     * Returns the remaining text after the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    afterLast(part: string) {
        const index = this.lastIndexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(index + part.length) as unknown) as Stringable
    }

    /**
     * Returns the text before the first occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    before(part: string) {
        const index = this.indexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(0, index) as unknown) as Stringable
    }

    /**
     * Returns the text before the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    beforeLast(part: string) {
        const index = this.lastIndexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(0, index) as unknown) as Stringable
    }

    /**
     * Returns the text between two given values.
     */
    between(start: string) {
        return {
            and: (end: string) => this.after(start).before(end),
            andLast: (end: string) => this.after(start).beforeLast(end),
        }
    }

    /**
     * Returns the text between the last occurrence of given value and second function respectively.
     */
    betweenLast(start: string) {
        return {
            and: (end: string) => this.afterLast(start).before(end),
            andLast: (end: string) => this.afterLast(start).beforeLast(end),
        }
    }

    /**
     * Executes callback if first given value evaluates to true.
     * Result will get transformed back into a flooent string if it is a raw string.
     */
    when<T>(comparison, then: (value: Stringable) => T) {
        const isBoolean = typeof comparison === "boolean"

        if (isBoolean && !comparison) {
            return this
        }

        if (!isBoolean && !comparison(this)) {
            return this
        }

        return (this.pipe(then) as unknown) as Stringable
    }

    /**
     * Executes callback if string is empty. Result will get transformed back into a flooent string if it is a raw string.
     */
    whenEmpty(then) {
        return this.when(this.is(""), then)
    }

    /**
     * Executes callback and transforms result back into a flooent string if the result is a string.
     */
    pipe(callback: (value: Stringable) => string): Stringable
    pipe<T>(callback: (value: Stringable) => T): T {
        const result = callback(this)
        if (result instanceof Stringable || typeof result !== 'string') return result

        return new this.constructor(result) as unknown as T
    }

    /**
     * Wraps a string with given value.
     */
    wrap(start: string, end = start) {
        return (this.prepend(start).append(end) as unknown) as Stringable
    }

    /**
     * Unwraps a string with given value.
     */
    unwrap(start: string, end = start) {
        return this
            .when(this.startsWith(start), (str) => str.substring(start.length))
            .when(this.endsWith(end), (str) => str.substring(0, str.length - end.length))
    }

    /**
     * Alias for `concat`. Appends given value to string.
     */
    append(part: string) {
        return (this.concat(part) as unknown) as Stringable
    }

    /**
     * Prepends given value to string.
     */
    prepend(part: string) {
        return new this.constructor(part + this)
    }

    /**
     * Compares given value with the raw string.
     */
    is(compare: string) {
        return this.valueOf() === compare
    }

    /**
     * Checks if string is included in the given array.
     */
    includedIn(array: string[]) {
        return array.indexOf(this.valueOf()) >= 0
    }

    /**
     * Appends given value only if string doesn't already end with it.
     */
    endWith(part: string) {
        if (this.endsWith(part)) {
            return this
        } else {
            return this.append(part)
        }
    }

    /**
     * Prepends given value only if string doesn't already start with it.
     */
    startWith(part: string) {
        if (this.startsWith(part)) {
            return this
        } else {
            return this.prepend(part)
        }
    }

    /**
     * Truncates text to given length and appends second argument if string got truncated.
     */
    limit(n: number, append = "...") {
        const raw = this.valueOf()
        let truncated = raw.slice(0, n)
        if (append && raw.length > n) {
            truncated += append
        }
        return new this.constructor(truncated)
    }

    /**
     * Turns string into title case.
     */
    title() {
        return new this.constructor(startcase((this as unknown) as string))
    }

    /**
     * Turns string into kebab case.
     */
    kebab() {
        return this.title().toLowerCase().replace(/\s/g, '-')
    }

    /**
     * Turns string into snake case.
     */
    snake() {
        return this.title().toLowerCase().replace(/\s/g, '_')
    }

    /**
     * Turns string into studly case.
     */
    studly() {
        return this.title().replace(/\s/g, '')
    }

    /**
     * Turns string into camel case.
     */
    camel() {
        const studly =  this.studly()
        if (studly.length === 0) return studly
        return new this.constructor(studly[0].toLowerCase() + studly.substring(1))
    }

    /**
     * Capitalizes first character.
     */
    capitalize() {
        if (this.length === 0) return this
        return new this.constructor(this[0].toUpperCase() + this.substring(1))
    }

    /**
     * Turns string into URL friendly slug.
     */
    slug(replacement = "-") {
        const value = this.valueOf()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9\s]/g, "")

        return new this.constructor(
            slugify(value, {
                replacement,
                lower: true,
                strict: true,
            })
        )
    }

    /**
     * Tap into the chain without modifying the string.
     */
    tap(fn: ((value: Stringable) => any)): Stringable {
        fn(this)
        return this
    }

    /**
     * Parses a string back into its original form. Examples:
     * given.string('true').parse() // true
     * given.string('23').parse() // 23
     */
    parse() {
        return JSON.parse(this as any)
    }
}

export default Stringable
