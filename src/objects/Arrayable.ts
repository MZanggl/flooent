import { Mappable } from '../index'
import { CopyFunction } from '../types'
import { getNthIndex } from '../utils'
import * as Arr from '../array'

class Arrayable<T> extends Array<T> {
    ["constructor"]!: typeof Arrayable
    ["next"]!: (...args: [] | [undefined]) => IteratorResult<T, any>
    ["filter"]!: CopyFunction<Array<T>['filter'], Arrayable<T>>

    static from<T, U = T>(iterable: Iterable<T> | ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): Arrayable<U> {
        return super.from(iterable, mapfn, thisArg) as Arrayable<U>
    }

    /**
     * Returns a raw array
     */
    valueOf() {
        return [...this]
    }

    /**
     * Returns the first element in the array.
     * Pass number as argument to return the first x elements.
     */
    first(count?: number) {
        return Arr.first(this, count)
    }

    /**
     * Returns the second element in the array or undefined.
     */
    second() {
        return Arr.second(this)
    }

    /**
     * Returns the last element in the array.
     * Pass number as argument to return the last x elements.
     * Pass callback as argument to return the last element that matches the given truth test (inverse of `find`).
     */
    last(countOrFn?: number | ((value: any) => any[])) {
        return Arr.last(this, countOrFn)
    }

    /**
     * Returns element at given index or undefined. If given value is negative, it searches from behind.
     */
    nth(index: number) {
        return Arr.nth(this, index)
    }

    /**
     * Returns the items until either the given value is found, or the given callback returns `true`.
     */
    until(comparison) {
        return this.constructor.from<T>(Arr.until(this, comparison))
    }
    
    /**
     * Return all items that don't pass the given truth test. Inverse of `Array.filter`
     */
    reject(callback: (item: T, index?: number) => boolean) {
        return Arr.reject(this, callback) as Arrayable<T>
    }
    
    /**
     * Moves an item in the array using the given source index to either "before" or "after" the given target.
     */
    move(source: number, position: 'before' | 'after', target: number) {
        return Arr.move(this, source, position, target) as Arrayable<T>
    }

    /**
     * Breaks the array into multiple, smaller arrays of a given size.
     */
    chunk(size: number) {
        const chunked = this.constructor.from(Arr.chunk(this, size))
        return chunked.map(chunk => this.constructor.from<T>(chunk))
    }

    /**
     * Returns the items for the given page and size.
     */
    forPage(page: number, size: number) {
        return Arr.forPage(this, page, size) as Arrayable<T>
    }

    /**
     * Fills up the array with the given value.
     */
    pad(size: number, value: T) {
        return Arr.pad(this, size, value) as Arrayable<T>
    }

    /**
     * Returns a boolean whether the array is empty or not.
     */
    isEmpty() {
        return Arr.isEmpty(this)
    }

    /**
     * @deprecated Alias for point.
     */
    at(indexOrFn: number | ((item: T) => boolean)) {
        return this.point(indexOrFn)
    }

    /**
     * Points to a specific index inside the array to do further actions on it.
     */
    point(indexOrFn: number | ((item: T) => boolean)) {
        const index = getNthIndex(this, indexOrFn)

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
            },
            /**
             * Returns value for current pointer position.
             */
            value() {
                return array[index]
            },
            /**
             * Steps forward or backward given the number of steps.
             */
            step(steps: number) {
                return array.point(index + steps)
            }
        }

        return pointer
    }

    /**
     * Filters array by given value or key/value pair.
     */
    where(key: keyof T, value) {
        return Arr.where(this, key, value) as Arrayable<T>
    }
    
    /**
     * Removes items from array by the given key or key/value pair.
     */
    whereNot(key: keyof T, value) {
        return Arr.whereNot(this, key, value) as Arrayable<T>
    }

    /**
     * Filters array by given values or key/values pair.
     */
    whereIn(key: keyof T, value) {
        return Arr.whereIn(this, key, value) as Arrayable<T>
    }

    /**
     * Removes items from array by the given value or key/values pair.
     */
    whereNotIn(key: keyof T, value) {
        return Arr.whereNotIn(this, key, value) as Arrayable<T>
    }

    /**
     * Only returns items which are not empty.
     */
    filled(key?: string) {
        return Arr.filled(this, key) as Arrayable<T>
    }

    /**
     * Mutates the original array with the return value of the given callback.
     */
    mutate(callback: ((array: T[]) => T[])) {
        return Arr.mutate(this, callback) as Arrayable<T>
    }

    /**
     * Groups an array by the given key and returns a flooent map.
     */
    groupBy<K extends keyof T>(key: K | ((item: T) => T[K]) ) {
        const grouped = Arr.groupBy(this, key)
        return new Mappable<T[K], Arrayable<T>>(grouped)
    }

    /**
     * Returns the sum of the array.
     * For arrays of objects: Pass field or callback as argument.
     */
    sum(key?: string | ((item: T) => number)) {
        return Arr.sum(this, key)
    }

    /**
     * Omits given keys from all objects in the array.
     */
    omit(keys: string[]) {
        return Arr.omit(this, keys) as Arrayable<T>
    }

    /**
     * Pluck the given field out of each object in the array.
     */
    pluck(key: keyof T) {
        return Arr.pluck(this, key)
    }

    /**
     * Returns array of unique values.
     * For array ob objects: Pass key or callback to use it for the comparison.
     */
    unique(key?: string | ((item: T) => string)) {
        return this.constructor.from(Arr.unique(this, key))
    }

    /**
     * Shuffles and returns a new array.
     */
    shuffle() {
        return Arr.shuffle(this)
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
        const partitioned = this.constructor.from(Arr.partition(this, callback))
        return partitioned.map(item => this.constructor.from(item))
    }

    /**
     * Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.
     */
    prepend(...items: T[]): Arrayable<T> {
        return this.constructor.from(Arr.prepend(this, ...items))
    }

    /**
     * Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.
     */
    append(...items: T[]): Arrayable<T> {
        return this.constructor.from(Arr.append(this, ...items))
    }

    /**
     * Sorts an array in descending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
    sortDesc(key?: string | number | ((item: T) => any)) {
        return this.constructor.from(Arr.sortDesc(this, key)) as Arrayable<T>
    }

    /**
     * Sorts an array in ascending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
    sortAsc(key?: string | number | ((item: T, index: number) => any)) {
        return this.constructor.from(Arr.sortAsc(this, key)) as Arrayable<T>
    }

    /**
     * Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.
     */
    toMap() {
        return new Mappable(this)
    }
}

export default Arrayable
