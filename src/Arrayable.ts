import uniq from "lodash.uniq"
import uniqby from "lodash.uniqby"
import shuffle from "lodash.shuffle"
import omit from "lodash.omit"
import clonedeep from "lodash.clonedeep"
import isequal from "lodash.isequal"
import chunk from "lodash.chunk"

class Arrayable extends Array {
    ["constructor"]!: typeof Arrayable

    first(count?: number) {
        if (count) {
            return (this.slice(0, count) as unknown) as Arrayable
        }

        return this[0]
    }

    second() {
        return this[1]
    }

    last(countOrFn?: number | ((value: any) => any[])) {
        if (typeof countOrFn === 'number') {
            return this.slice(this.length - countOrFn) as Arrayable
        } else if (typeof countOrFn === 'function') {
            const filteredItems = this.filter(countOrFn)
            return filteredItems[filteredItems.length - 1]
        }

        return this[this.length - 1]
    }

    nth(index: number) {
        if (index < 0) {
            index = this.length + index
        }
        return this[index]
    }

    until(comparison) {
        const newArray = this.constructor.from([])
        for (const item of this) {
          const reachedEnd = (typeof comparison === "function" && comparison(item)) || item === comparison
          if (reachedEnd) {
            break
          }
          newArray.push(item)
        }
        return newArray
    }

    chunk(n) {
        return this.constructor.from(chunk(this, n)).map(item => this.constructor.from(item as any[]))
    }

    forPage(page: number, size: number) {
        const from = ((page - 1) * size)
        return this.slice(from, from + size)
    }

    pad(size: number, value) {
        const copy = this.constructor.from(this)
        while (copy.length < size) copy.push(value)
        return copy
    }

    isEmpty() {
        return this.length < 1
    }

    whereNot(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => item !== value) as Arrayable
        }

        return this.filter((item) => item[key] !== value) as Arrayable
    }

    where(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => item === value) as Arrayable
        }

        return this.filter((item) => item[key] === value) as Arrayable
    }

    whereIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => value.includes(item)) as Arrayable
        }

        return this.filter((item) => value.includes(item[key])) as Arrayable
    }

    whereNotIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => !value.includes(item)) as Arrayable
        }

        return this.filter((item) => !value.includes(item[key])) as Arrayable
    }

    filled(key?: string) {
        if (!key) {
            return this.filter((value) => !!value) as Arrayable
        }

        return this.filter((item) => !!item[key]) as Arrayable
    }

    clone() {
        // lodash does array.constructor(lenght) which doesn't work on subclassed arrays
        return this.constructor.from(clonedeep([...this])) as Arrayable
    }

    groupBy(key: string | Function) {
        return this.reduce<{ [key: string]: Arrayable }>((result, item) => {
            const group = typeof key === "function" ? key(item) : item[key]
            result[group] = result[group] || new this.constructor()
            result[group].push(item)
            return result
        }, {})
    }

    sum(key?: string | Function) {
        return this.reduce<number>((result, item) => {
            let number = item
            if (key) {
                number = typeof key === "function" ? key(item) : item[key]
            }
            return result + number
        }, 0)
    }

    forget(keys) {
        keys = Array.isArray(keys) ? keys : [keys]
        return this.map((item) => {
            return omit(item, keys)
        }) as Arrayable
    }

    pluck(key: string) {
        return this.map((item) => item[key]) as Arrayable
    }

    unique(key?: string | Function) {
        if (!key) {
            return this.constructor.from(uniq(this)) as Arrayable
        }

        const compareFn = typeof key === "function" ? key : (item) => item[key]
        return this.constructor.from(uniqby(this, compareFn)) as Arrayable
    }

    shuffle() {
        return this.constructor.from(shuffle(this)) as Arrayable
    }

    is(compareWith) {
        return isequal(this, compareWith)
    }

    quacksLike(duck) {
        return this.is(duck)
    }

    tap(fn: Function): Arrayable {
        fn(this)
        return this
    }

    pipe(callback: Function) {
        return this.constructor.from(callback(this)) as Arrayable
    }

    when(comparison, then: Function) {
        const isBoolean = typeof comparison === "boolean"

        if (isBoolean && !comparison) {
            return this
        }

        if (!isBoolean && !comparison(this)) {
            return this
        }

        return this.pipe(then)
    }

    partition(callback: Function) {
        const tuple = [this.constructor.from([]), this.constructor.from([])] as [Arrayable, Arrayable]

        for (const item of this) {
            const index = callback(item) ? 0 : 1
            tuple[index].push(item)
        }

        return tuple
    }

    prepend(...items): Arrayable {
        this.unshift(...items)
        return this
    }

    append(...items): Arrayable {
        this.push(...items)
        return this
    }

    sortDesc(key?: string) {
        if (!key) {
            return this.constructor.from(this).sort().reverse() as Arrayable
        }
        return this.constructor.from(this).sort((a, b) => b[key] - a[key]) as Arrayable
    }

    sortAsc(key?: string) {
        if (!key) {
            return this.constructor.from(this).sort() as Arrayable
        }
        return this.constructor.from(this).sort((a, b) => a[key] - b[key]) as Arrayable
    }
}

export default Arrayable
