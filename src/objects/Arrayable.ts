import uniq from "lodash.uniq"
import uniqby from "lodash.uniqby"
import shuffle from "lodash.shuffle"
import omit from "lodash.omit"
import clonedeep from "lodash.clonedeep"
import isequal from "lodash.isequal"
import chunk from "lodash.chunk"
import { Mappable } from '../index'
import { CopyFunction } from '../types'

class Arrayable<T> extends Array<T> {
    ["constructor"]!: typeof Arrayable
    ["next"]!: (...args: [] | [undefined]) => IteratorResult<T, any>
    ["filter"]!: CopyFunction<Array<T>['filter'], Arrayable<T>>

    static from<T, U = T>(iterable: Iterable<T> | ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): Arrayable<U> {
        return super.from(iterable, mapfn, thisArg) as Arrayable<U>
    }

    first(count?: number) {
        if (count) {
            return (this.slice(0, count) as unknown) as Arrayable<T>
        }

        return this[0]
    }

    second() {
        return this[1]
    }

    last(countOrFn?: number | ((value: any) => any[])) {
        if (typeof countOrFn === 'number') {
            return this.slice(this.length - countOrFn) as Arrayable<T>
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
            return this.filter((item) => item !== value) as Arrayable<T>
        }

        return this.filter((item) => item[key] !== value) as Arrayable<T>
    }

    at(indexOrFn: number | ((item: T) => boolean)) {
        let index: number

        if (typeof indexOrFn === 'number') {
            index = indexOrFn < 0 ? this.length + indexOrFn : indexOrFn
        } else {
            index = this.findIndex(indexOrFn)
        }

        const array = this
        const pointer = {
            append(item: T) {
                const [before, after] = array.partition((item, i) => i <= index)
                return [...before, item, ...after]
            },
            prepend(item: T) {
                const [before, after] = array.partition((item, i) => i < index)
                return [...before, item, ...after]
            }
        }

        return pointer
    }

    where(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => item === value) as Arrayable<T>
        }

        return this.filter((item) => item[key] === value) as Arrayable<T>
    }

    whereIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => value.includes(item)) as Arrayable<T>
        }

        return this.filter((item) => value.includes(item[key])) as Arrayable<T>
    }

    whereNotIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => !value.includes(item)) as Arrayable<T>
        }

        return this.filter((item) => !value.includes(item[key])) as Arrayable<T>
    }

    filled(key?: string) {
        if (!key) {
            return this.filter((value) => !!value) as Arrayable<T>
        }

        return this.filter((item) => !!item[key]) as Arrayable<T>
    }

    clone() {
        // lodash does array.constructor(lenght) which doesn't work on subclassed arrays
        return this.constructor.from(clonedeep([...this])) as Arrayable<T>
    }

    groupBy<K extends keyof T>(key: K | ((item: T) => T[K]) ) {
        return this.reduce<Mappable<T[K], Arrayable<T>>>((result, item) => {
            const group = typeof key === "function" ? key(item) : item[key]
            if (result.has(group)) {
                result.get(group).push(item)
            } else {
                result.set(group, this.constructor.from([item]))
            }
            return result
        }, new Mappable<T[K], Arrayable<T>>())
    }

    sum(key?: string | ((item: T) => number)) {
        return this.reduce<number>((result, item) => {
            let number = item
            if (key) {
                number = typeof key === "function" ? key(item) : item[key]
            }
            return result + (number as unknown as number)
        }, 0)
    }

    forget(keys) {
        keys = Array.isArray(keys) ? keys : [keys]
        return (this as unknown as Object[]).map((item) => {
            return omit(item, keys)
        }) as Arrayable<T>
    }

    pluck(key: string) {
        return this.map((item) => item[key]) as Arrayable<T>
    }

    unique(key?: string | ((item: T) => any)) {
        if (!key) {
            return this.constructor.from(uniq(this)) as Arrayable<T>
        }

        const compareFn = typeof key === "function" ? key : (item) => item[key]
        return this.constructor.from(uniqby(this, compareFn)) as Arrayable<T>
    }

    shuffle() {
        return this.constructor.from(shuffle(this)) as Arrayable<T>
    }

    is(compareWith) {
        return isequal(this, compareWith)
    }

    quacksLike(duck) {
        return this.is(duck)
    }

    tap(fn: Function): this {
        fn(this)
        return this
    }

    pipe(callback: Function) {
        return this.constructor.from(callback(this)) as Arrayable<T>
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
        const tuple = [this.constructor.from([]), this.constructor.from([])] as [Arrayable<T>, Arrayable<T>]

        this.forEach((item, index) => {
            const tupleIndex = callback(item, index) ? 0 : 1
            tuple[tupleIndex].push(item)
        })

        return tuple
    }

    prepend(...items): Arrayable<T> {
        this.unshift(...items)
        return this
    }

    append(...items): Arrayable<T> {
        this.push(...items)
        return this
    }

    sortDesc(key?: string | number | ((item: T) => any)) {
        return this.sortAsc(key).reverse()
    }

    sortAsc(key?: string | number | ((item: T, index: number) => any)) {
        if (!key) {
            return this.constructor.from(this).sort() as Arrayable<T>
        }

         if (typeof key === 'function') {
            return this.map((item, index) => {
                return { sortKey: key(item, index), item }
            })
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(item => item.item) as Arrayable<T>
        }
        
        return this.constructor.from(this).sort((a, b) => a[key] - b[key]) as Arrayable<T>
    }

    toMap() {
        return new Mappable(this)
    }
}

export default Arrayable
