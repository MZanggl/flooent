import {
    after,
    afterLast,
    before,
    beforeLast,
    wrap,
    unwrap,
    append,
    prepend,
    endWith,
    startWith,
    limit,
    title,
    kebab,
    snake,
    studly,
    camel,
    capitalize,
    slug
} from '../string'

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
        return after(this, part)
    }

    /**
     * Returns the remaining text after the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    afterLast(part: string) {
        return afterLast(this, part)
    }

    /**
     * Returns the text before the first occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    before(part: string) {
        return before(this, part)
    }

    /**
     * Returns the text before the last occurrence of the given value.
     * If the value does not exist in the string, the entire string is returned unchanged.
     */
    beforeLast(part: string) {
        return beforeLast(this, part)
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
        return this.when(this.valueOf() === "", then)
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
        return new this.constructor(wrap(this.valueOf(), start, end))
    }

    /**
     * Unwraps a string with the given value.
     */
    unwrap(start: string, end = start) {
        return unwrap(this, start, end)
    }

    /**
     * Alias for `concat`. Appends the given value to string.
     */
    append(part: string) {
        return append(this, part)
    }

    /**
     * Prepends the given value to string.
     */
    prepend(part: string) {
        return new this.constructor(prepend(this.valueOf(), part))
    }

    /**
     * Appends the given value only if string doesn't already end with it.
     */
    endWith(part: string) {
        return endWith(this, part)
    }

    /**
     * Prepends the given value only if string doesn't already start with it.
     */
    startWith(part: string) {
        return new this.constructor(startWith(this, part))
    }

    /**
     * Truncates text to given length and appends second argument if string got truncated.
     */
    limit(n: number, append = "...") {
        return limit(this, n, append)
    }

    /**
     * Turns the string into title case.
     */
    title() {
        return new this.constructor(title(this))
    }

    /**
     * Turns the string into kebab case.
     */
    kebab() {
        const words = kebab(this)
        return new this.constructor(words)
    }

    /**
     * Turns the string into snake case.
     */
    snake(replacement = '_') {
        const words = snake(this, replacement)
        return new this.constructor(words)
    }

    /**
     * Turns the string into studly case.
     */
    studly() {
        const words = studly(this)
        return new this.constructor(words)
    }

    /**
     * Turns the string into camel case.
     */
    camel() {
        return new this.constructor(camel(this))
    }

    /**
     * Capitalizes the first character.
     */
    capitalize() {
        return new this.constructor(capitalize(this))
    }

    /**
     * Turns the string into URI conform slug.
     */
    slug(replacement = "-") {
        return new this.constructor(slug(this, replacement))
    }
}

export default Stringable
