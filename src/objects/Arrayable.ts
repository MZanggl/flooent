import isequal from "lodash.isequal"
import clonedeep from "lodash.clonedeep"
import { Mappable } from '../index'
import { CopyFunction } from '../types'

class Arrayable<T> extends Array<T> {
    ["constructor"]!: typeof Arrayable
    ["next"]!: (...args: [] | [undefined]) => IteratorResult<T, any>
    ["filter"]!: CopyFunction<Array<T>['filter'], Arrayable<T>>

    static from<T, U = T>(iterable: Iterable<T> | ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): Arrayable<U> {
        return super.from(iterable, mapfn, thisArg) as Arrayable<U>
    }

    /**
     * Returns the first element in the array.
     * Pass number as argument to return the first x elements.
     */
    first(count?: number) {
        if (count) {
            return (this.slice(0, count) as unknown) as Arrayable<T>
        }

        return this[0]
    }

    /**
     * Returns the second element in the array or undefined.
     */
    second() {
        return this[1]
    }

    /**
     * Returns the last element in the array.
     * Pass number as argument to return the last x elements.
     * Pass callback as argument to return the last element that matches the given truth test (inverse of `find`).
     */
    last(countOrFn?: number | ((value: any) => any[])) {
        if (typeof countOrFn === 'number') {
            return this.slice(this.length - countOrFn) as Arrayable<T>
        } else if (typeof countOrFn === 'function') {
            const filteredItems = this.filter(countOrFn)
            return filteredItems[filteredItems.length - 1]
        }

        return this[this.length - 1]
    }

    /**
     * Returns element at given index or undefined. If given value is negative, it searches from behind.
     */
    nth(index: number) {
        if (index < 0) {
            index = this.length + index
        }
        return this[index]
    }

    /**
     * Returns the items until either the given value is found, or the given callback returns `true`.
     */
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

    /**
     * Breaks the array into multiple, smaller arrays of a given size.
     */
    chunk(n) {
        const remaining = [...this]
        const chunks = this.constructor.from([])
        while (remaining.length > 0) {
            chunks.push(this.constructor.from(remaining.splice(0, n)))
        }
        return chunks
    }

    /**
     * Returns the items for the given page and size.
     */
    forPage(page: number, size: number) {
        const from = ((page - 1) * size)
        return this.slice(from, from + size)
    }

    /**
     * Fills up the array with the given value.
     */
    pad(size: number, value) {
        const copy = this.constructor.from(this)
        while (copy.length < size) copy.push(value)
        return copy
    }

    /**
     * Returns a boolean whether the array is empty or not.
     */
    isEmpty() {
        return this.length < 1
    }

    /**
     * Points to a specific index inside the array to do further actions on it.
     */
    at(indexOrFn: number | ((item: T) => boolean)) {
        let index: number

        if (typeof indexOrFn === 'number') {
            index = indexOrFn < 0 ? this.length + indexOrFn : indexOrFn
        } else {
            index = this.findIndex(indexOrFn)
        }

        const array = this
        const pointer = {
            /**
             * Sets the value at the current index and returns a new array.
             */
            set(callback: (item: T) => T) {
                const copy = array.constructor.from(array)
                copy[index] = callback(copy[index])
                return copy
            },
            /**
             * Appends given value to array in between the currently pointed item and its next item and returns a new array.
             */
            append(...items: T[]) {
                const [before, after] = array.partition((item, i) => i <= index)
                return array.constructor.from([...before, ...items, ...after])
            },
            /**
             * Prepends given value to array in between the currently pointed item and its previous item and returns a new array.
             */
            prepend(...items: T[]) {
                const [before, after] = array.partition((item, i) => i < index)
                return array.constructor.from([...before, ...items, ...after])
            }
        }

        return pointer
    }

    /**
     * Filters array by given value or key/value pair.
     */
    where(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => item === value) as Arrayable<T>
        }

        return this.filter((item) => item[key] === value) as Arrayable<T>
    }
    
    /**
     * Removes items from array by the given key or key/value pair.
     */
    whereNot(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => item !== value) as Arrayable<T>
        }

        return this.filter((item) => item[key] !== value) as Arrayable<T>
    }

    /**
     * Filters array by given values or key/values pair.
     */
    whereIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => value.includes(item)) as Arrayable<T>
        }

        return this.filter((item) => value.includes(item[key])) as Arrayable<T>
    }

    /**
     * Removes items from array by the given value or key/values pair.
     */
    whereNotIn(key, value = key) {
        if (arguments.length === 1) {
            return this.filter((item) => !value.includes(item)) as Arrayable<T>
        }

        return this.filter((item) => !value.includes(item[key])) as Arrayable<T>
    }

    /**
     * Only returns items which are not empty.
     */
    filled(key?: string) {
        if (!key) {
            return this.filter((value) => !!value) as Arrayable<T>
        }

        return this.filter((item) => !!item[key]) as Arrayable<T>
    }

    /**
     * Deep clones the array.
     */
    clone() {
        // lodash does array.constructor(lenght) which doesn't work on subclassed arrays
        return this.constructor.from(clonedeep([...this])) as Arrayable<T>
    }

    /**
     * Mutates the original array with the return value of the given callback.
     */
    mutate(callback: ((array: T[]) => T[])) {
        const mutation = callback(this)
        this.splice(0)
        this.splice(0, 0, ...mutation)
        return this
    }

    /**
     * Groups an array by the given key and returns a flooent map.
     */
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

    /**
     * Returns the sum of the array.
     * For arrays of objects: Pass field or callback as argument.
     */
    sum(key?: string | ((item: T) => number)) {
        return this.reduce<number>((result, item) => {
            let number = item
            if (key) {
                number = typeof key === "function" ? key(item) : item[key]
            }
            return result + (number as unknown as number)
        }, 0)
    }

    /**
     * Omits given keys from all objects in the array.
     */
    omit(keys: string[]) {
        return (this as unknown as Object[]).map((item) => {
            const copy = {...item}
            keys.forEach(key => delete copy[key])
            return copy
        }) as Arrayable<T>
    }

    /**
     * Pluck the given field out of each object in the array.
     */
    pluck(key: string) {
        return this.map((item) => item[key]) as Arrayable<T>
    }

    /**
     * Returns array of unique values.
     * For array ob objects: Pass key or callback to use it for the comparison.
     */
    unique(key?: string | ((item: T) => string)) {
        if (!key) {
            return this.constructor.from([...new Set(this)])
        }

        const cache = new Map()
        const unique = new Arrayable
        if (typeof key === "function") {
            for (const item of this) {
                const value = key(item)
                if (!cache.has(value)) {
                    cache.set(value, 1)
                    unique.push(item)
                }
            }
            return unique
        }

        for (const item of this) {
            if (cache.has(item[key])) continue
            cache.set(item[key], 1)
            unique.push(item)
        }
        return unique
    }

    /**
     * Shuffles and returns a new array.
     */
    shuffle() {
        const array = this.constructor.from(this)
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    /**
     * Deep-compares the given value with the array.
     */
    is(compareWith) {
        return isequal(this, compareWith)
    }

    /**
     * Deep-compares the given value with the array.
     */
    quacksLike(duck) {
        return this.is(duck)
    }

    /**
     * Tap into the chain without modifying the array.
     */
    tap(fn: ((value: Arrayable<T>) => any)): this {
        fn(this)
        return this
    }

    /**
     * Executes callback and transforms result back into a flooent array if it is an array.
     */
    pipe(callback: (value: Arrayable<T>) => T[]): Arrayable<T>
    pipe<P>(callback: (value: Arrayable<T>) => P): P
    pipe(callback) {
        const result = callback(this)
        return Array.isArray(result) ? this.constructor.from<T>(result) : result
    }

    /**
     * Executes callback if first given value evaluates to true. Result will get transformed back into a flooent array if it is an array.
     */
    when<P>(comparison, then: ((value: Arrayable<T>) => P)) {
        const isBoolean = typeof comparison === "boolean"

        if (isBoolean && !comparison) {
            return this
        }

        if (!isBoolean && !comparison(this)) {
            return this
        }

        return this.pipe(then)
    }

    /**
     * Returns a tuple separating the items that pass the given truth test.
     */
    partition(callback: Function) {
        const tuple = [this.constructor.from([]), this.constructor.from([])] as [Arrayable<T>, Arrayable<T>]

        this.forEach((item, index) => {
            const tupleIndex = callback(item, index) ? 0 : 1
            tuple[tupleIndex].push(item)
        })

        return tuple
    }

    /**
     * Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.
     */
    prepend(...items): Arrayable<T> {
        return this.constructor.from([...items, ...this])
    }

    /**
     * Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.
     */
    append(...items): Arrayable<T> {
        return this.constructor.from([...this, ...items])
    }

    /**
     * Sorts an array in descending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
    sortDesc(key?: string | number | ((item: T) => any)) {
        return this.sortAsc(key).reverse()
    }

    /**
     * Sorts an array in ascending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
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

    /**
     * Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.
     */
    toMap() {
        return new Mappable(this)
    }
}

export default Arrayable
