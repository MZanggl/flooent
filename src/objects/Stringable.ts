import upperFirst from "lodash.upperfirst"
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

const symbol = Symbol("Stringable")

class Stringable extends String {
    ["constructor"]!: typeof Stringable
    _symbol = symbol

    constructor(value) {
        super(value)

        override.forEach((name) => {
            this[name] = (...args) => {
                return new this.constructor(super[name](...args))
            }
        })
    }

    after(part: string) {
        const index = this.indexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(index + part.length) as unknown) as Stringable
    }

    afterLast(part: string) {
        const index = this.lastIndexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(index + part.length) as unknown) as Stringable
    }

    before(part: string) {
        const index = this.indexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(0, index) as unknown) as Stringable
    }

    beforeLast(part: string) {
        const index = this.lastIndexOf(part)
        if (index === -1) {
            return this
        }
        return (this.slice(0, index) as unknown) as Stringable
    }

    between(start: string) {
        return {
            and: (end: string) => this.after(start).before(end),
            andLast: (end: string) => this.after(start).beforeLast(end),
        }
    }

    betweenLast(start: string) {
        return {
            and: (end: string) => this.afterLast(start).before(end),
            andLast: (end: string) => this.afterLast(start).beforeLast(end),
        }
    }

    when(comparison, then: Function) {
        const isBoolean = typeof comparison === "boolean"

        if (isBoolean && !comparison) {
            return this
        }

        if (!isBoolean && !comparison(this)) {
            return this
        }

        return (this.pipe(then) as unknown) as Stringable
    }

    whenEmpty(then) {
        return this.when(this.is(""), then)
    }

    pipe(callback: Function): Stringable {
        const result = callback(this)
        return result._symbol === symbol ? result : ((new this.constructor(result) as unknown) as Stringable)
    }

    wrap(start: string, end = start) {
        return (this.prepend(start).append(end) as unknown) as Stringable
    }

    unwrap(start: string, end = start) {
        return this.when(this.startsWith(start), (str) => str.substring(start.length)).when(this.endsWith(end), (str) =>
            str.substring(0, str.length - end.length)
        )
    }

    append(part: string) {
        return (this.concat(part) as unknown) as Stringable
    }

    prepend(part: string) {
        return new this.constructor(part + this)
    }

    is(compare: string) {
        return this.valueOf() === compare
    }

    includedIn(array: string[]) {
        return array.indexOf(this.valueOf()) >= 0
    }

    endWith(part: string) {
        if (this.endsWith(part)) {
            return this
        } else {
            return this.append(part)
        }
    }

    startWith(part: string) {
        if (this.startsWith(part)) {
            return this
        } else {
            return this.prepend(part)
        }
    }

    limit(n: number, append = "...") {
        const raw = this.valueOf()
        let truncated = raw.slice(0, n)
        if (append && raw.length > n) {
            truncated += append
        }
        return new this.constructor(truncated)
    }

    title() {
        return new this.constructor(startcase((this as unknown) as string))
    }

    capitalize() {
        return new this.constructor(upperFirst((this as unknown) as string))
    }

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

    tap(fn): Stringable {
        fn(this)
        return this
    }

    parse() {
        return JSON.parse(this as any)
    }
}

export default Stringable
