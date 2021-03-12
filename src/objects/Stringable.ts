import * as Str from '../string'

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
        return Str.after(this, part)
    }

    /**
     * Returns the remaining text after the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    afterLast(part: string) {
        return Str.afterLast(this, part)
    }

    /**
     * Returns the text before the first occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    before(part: string) {
        return Str.before(this, part)
    }

    /**
     * Returns the text before the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    beforeLast(part: string) {
        return Str.beforeLast(this, part)
    }

    /**
     * Returns the text between two given values.
     * @deprecated Use after('a').before('b') or after('a').beforeLast('b')
     */
    between(start: string) {
        return {
            and: (end: string) => this.after(start).before(end) as Stringable,
            andLast: (end: string) => this.after(start).beforeLast(end) as Stringable,
        }
    }

    /**
     * Returns the text between the last occurrence of given value and second function respectively.
     * @deprecated Use afterLast('a').before('b') or afterLast('a').beforeLast('b')
     */
    betweenLast(start: string) {
        return {
            and: (end: string) => this.afterLast(start).before(end) as Stringable,
            andLast: (end: string) => this.afterLast(start).beforeLast(end) as Stringable,
        }
    }

    /**
     * Executes the callback if first given value evaluates to true. Result will get transformed back into a flooent string if it is a raw string.
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
     * Executes the callback if string is empty. Result will get transformed back into a flooent string if it is a raw string.
     */
    whenEmpty(then) {
        return this.when(this.is(""), then)
    }

    /**
     * Executes the callback and transforms the result back into a flooent string if it is a string.
     */
    pipe(callback: (value: Stringable) => string): Stringable
    pipe<T>(callback: (value: Stringable) => T): T
    pipe(callback) {
        const result = callback(this)
        if (result instanceof Stringable || typeof result !== 'string') return result

        return new this.constructor(result)
    }

    /**
     * Tap into the chain without modifying the string.
     */
    tap(fn: ((value: Stringable) => any)): Stringable {
        fn(this)
        return this
    }

    /**
     * Wraps a string with the given value.
     */
    wrap(start: string, end = start) {
        return new this.constructor(Str.wrap(this.valueOf(), start, end))
    }

    /**
     * Unwraps a string with the given value.
     */
    unwrap(start: string, end = start) {
        return Str.unwrap(this, start, end)
    }

    /**
     * Alias for `concat`. Appends the given value to string.
     */
    append(part: string) {
        return Str.append(this, part)
    }

    /**
     * Prepends the given value to string.
     */
    prepend(part: string) {
        return new this.constructor(Str.prepend(this.valueOf(), part))
    }

    /**
     * Compares the given value with the raw string.
     */
    is(compare: string) {
        return this.valueOf() === compare
    }

    /**
     * Checks if the string is included in the given array.
     */
    includedIn(array: string[]) {
        return Str.includedIn(this.valueOf(), array)
    }

    /**
     * Appends the given value only if string doesn't already end with it.
     */
    endWith(part: string) {
        return Str.endWith(this, part)
    }

    /**
     * Prepends the given value only if string doesn't already start with it.
     */
    startWith(part: string) {
        return new this.constructor(Str.startWith(this, part))
    }

    /**
     * Truncates text to given length and appends second argument if string got truncated.
     */
    limit(n: number, append = "...") {
        return Str.limit(this, n, append)
    }

    /**
     * Turns the string into title case.
     */
    title() {
        return new this.constructor(Str.title(this))
    }

    /**
     * Turns the string into kebab case.
     */
    kebab() {
        return this.snake('-')
    }

    /**
     * Turns the string into snake case.
     */
    snake(replacement = '_') {
        const words = Str.snake(this, replacement)
        return new this.constructor(words)
    }

    /**
     * Turns the string into studly case.
     */
    studly() {
        const words = Str.studly(this)
        return new this.constructor(words)
    }

    /**
     * Turns the string into camel case.
     */
    camel() {
        return new this.constructor(Str.camel(this))
    }

    /**
     * Capitalizes the first character.
     */
    capitalize() {
        return new this.constructor(Str.capitalize(this))
    }

    /**
     * Turns the string into URI conform slug.
     */
    slug(replacement = "-") {
        return new this.constructor(Str.slug(this, replacement))
    }

    /**
     * Parses a string back into its original form. Examples:
     * given.string('true').parse() // true
     * given.string('23').parse() // 23
     */
    parse<R>() {
        return Str.parse(this) as R
    }
}

export default Stringable
