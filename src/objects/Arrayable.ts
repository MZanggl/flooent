import { Mappable, Stringable } from '../index'
import { CopyFunction } from '../types'
import * as Arr from '../array'
import * as MapUtils from '../map'

class Arrayable<T> extends Array<T> {
    ["constructor"]!: typeof Arrayable
    ["next"]!: (...args: [] | [undefined]) => IteratorResult<T, any>
    ["filter"]!: CopyFunction<Array<T>['filter'], Arrayable<T>>

    static from<T, U = T>(iterable: Iterable<T> | ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): Arrayable<U> {
        return super.from(iterable, mapfn, thisArg) as Arrayable<U>
    }

    /**
     * Executes callback for number of base values' times and returns a flooent array with the result of each iteration.
     */
    static $sized = function<T = void>(length: number, callback: (index: number) => T[]) {
        return this.from(Arr.sized(length, callback))
    }

    /**
     * Returns a raw array
     */
    $value() {
        return this.valueOf()
    }

    /**
     * Returns a raw array
     */
    valueOf() {
        if (this[0] instanceof Arrayable || this[0] instanceof Mappable || this[0] instanceof Stringable) {
            return [...(this as unknown as T[][]).map(items => {
                return items?.valueOf?.() ?? items
            })]
        }

        return [...this]
    }

    /**
     * Returns the items until either the given value is found, or the given callback returns `true`.
     */
    $until(comparison: T | ((item: T, index: number) => boolean)) {
        return this.constructor.from<T>(Arr.until(this, comparison))
    }
    
    /**
     * Return all items that don't pass the given truth test. Inverse of `Array.filter`
     */
    $reject(callback: (item: T, index?: number) => boolean) {
        return Arr.reject(this, callback) as Arrayable<T>
    }
    
    /**
     * Moves an item in the array using the given source index to either "before" or "after" the given target.
     */
    $move(source: number, position: 'before' | 'after', target: number) {
        return Arr.move(this, source, position, target) as Arrayable<T>
    }

    /**
     * Breaks the array into multiple, smaller arrays of a given size.
     */
    $chunk(size: number) {
        const chunked = this.constructor.from(Arr.chunk(this, size))
        return chunked.map(chunk => this.constructor.from<T>(chunk))
    }

    /**
     * Returns the items for the given page and size.
     */
    $forPage(page: number, size: number) {
        return Arr.forPage(this, page, size) as Arrayable<T>
    }

    /**
     * Fills up the array with the given value.
     */
    $pad(size: number, value: T) {
        return Arr.pad(this, size, value) as Arrayable<T>
    }

    /**
     * Points to a specific index inside the array to do further actions on it.
     */
    $point(indexOrFn: number | ((item: T) => boolean)) {
        const array = this
        const nativePointer = Arr.point(array, indexOrFn)
        const pointer = {
            /**
             * Sets the value at the current index and returns a new array.
             */
            $set(callback: (item: T) => T) {
                return nativePointer.set(callback)
            },

            /**
             * Splits the array at the current index
             */
            $split() {
                return array.constructor.from(nativePointer.split())
            },

            /**
             * Appends given value to array in between the currently pointed item and its next item and returns a new array.
             */
            $append(...items: T[]) {
                return array.constructor.from(nativePointer.append(...items))
            },
            /**
             * Prepends given value to array in between the currently pointed item and its previous item and returns a new array.
             */
            $prepend(...items: T[]) {
                return array.constructor.from(nativePointer.prepend(...items))
            },
            /**
             * Removes the current index and returns a new array.
             */
            $remove() {
                return nativePointer.remove()
            },
            /**
             * Returns value for current pointer position.
             */
            $value() {
                return nativePointer.value()
            },
            /**
             * Returns index for current pointer position.
             */
            $index() {
                return nativePointer.index()
            },
            /**
             * Steps forward or backward given the number of steps.
             */
            $step(steps: number) {
                return array.$point(nativePointer.index() + steps)
            }
        }

        return pointer
    }

    /**
     * Filters array by given value or key/value pair.
     */
    $where(value: T): Arrayable<T>
    $where<K extends keyof T>(key: K, value: T[K]): Arrayable<T>
    $where<K extends keyof T>(keyOrValue: T | K, value?: T[K]) {
        return Arr.where(this, keyOrValue, value) as Arrayable<T>
    }
    
    /**
     * Removes items from array by the given key or key/value pair.
     */
    $whereNot(value: T): Arrayable<T>
    $whereNot<K extends keyof T>(key: K, value: T[K]): Arrayable<T>
    $whereNot<K extends keyof T>(keyOrValue: T | K, value?: T[K]) {
        return Arr.whereNot(this, keyOrValue, value) as Arrayable<T>
    }

    /**
     * Filters array by given values or key/values pair.
     */
    $whereIn(value: T[]): Arrayable<T>
    $whereIn<K extends keyof T>(key: K, value: T[K][]): Arrayable<T>
    $whereIn<K extends keyof T>(keyOrValue: T | K, value?: T[K][]) {
        return Arr.whereIn(this, keyOrValue, value) as Arrayable<T>
    }

    /**
     * Removes items from array by the given value or key/values pair.
     */
    $whereNotIn(value: T[]): Arrayable<T>
    $whereNotIn<K extends keyof T>(key: K, value: T[K][]): Arrayable<T>
    $whereNotIn<K extends keyof T>(keyOrValue: T | K, value?: T[K][]) {
        return Arr.whereNotIn(this, keyOrValue, value) as Arrayable<T>
    }

    /**
     * Only returns items which are not empty.
     */
    $filled(comparison?: string | ((item: T, index: number) => boolean)) {
        return Arr.filled(this, comparison) as Arrayable<T>
    }

    /**
     * Mutates the original array with the return value of the given callback.
     */
    $mutate(callback: ((array: T[]) => T[])) {
        return Arr.mutate(this, callback) as Arrayable<T>
    }

    /**
     * Keys the collection by the given key and returns a flooent map.
     * If multiple items have the same key, only the last one will appear in the new collection.
     */
    $keyBy<K extends keyof T>(key: K | ((item: T, index: number) => T[K]) ) {
        const keyed = Arr.keyBy(this, key)
        return new Mappable<T[K], T>(keyed)
    }

    /**
     * Groups an array by the given key and returns a flooent map.
     */
    $groupBy<K extends keyof T>(key: K | ((item: T, index: number) => T[K]) ) {
        const grouped = MapUtils.groupBy(this, key)
        return new Mappable(grouped)
    }

    /**
     * Turns the given array into a map with each element becoming a key in the map.
     */
    $toKeyedMap<DV>(defaultValueOrCallback: DV | ((item: T) => DV)) {
        return new Mappable<T, DV>(Arr.toKeyedMap(this, defaultValueOrCallback))
    }

    /**
     * Returns the sum of the array.
     * For arrays of objects: Pass field or callback as argument.
     */
    $sum(key?: string | ((item: T, index: number) => number)) {
        return Arr.sum(this, key)
    }

    /**
     * Omits given keys from all objects in the array.
     */
    $omit(keys: string[]) {
        return Arr.omit(this, keys) as Arrayable<T>
    }

    /**
     * Pluck the given field out of each object in the array.
     */
    $pluck(key: keyof T) {
        return Arr.pluck(this, key)
    }

    /**
     * Returns array of unique values.
     * For array ob objects: Pass key or callback to use it for the comparison.
     */
    $unique(comparison?: string | ((item: T, index: number) => any)) {
        return this.constructor.from(Arr.unique(this, comparison))
    }

    /**
     * Shuffles and returns a new array.
     */
    $shuffle() {
        return Arr.shuffle(this)
    }

    /**
     * Tap into the chain without modifying the array.
     */
    $tap(fn: ((value: Arrayable<T>) => any)): this {
        fn(this)
        return this
    }

    /**
     * Executes callback and transforms result back into a flooent array if it is an array.
     */
    $pipe(callback: (value: Arrayable<T>) => T[]): Arrayable<T>
    $pipe<P>(callback: (value: Arrayable<T>) => P): P
    $pipe(callback) {
        const result = callback(this)
        return Array.isArray(result) ? this.constructor.from<T>(result) : result
    }

    /**
     * Executes callback if first given value evaluates to true. Result will get transformed back into a flooent array if it is an array.
     */
    $when<P>(comparison, then: ((value: Arrayable<T>) => P)) {
        const isBoolean = typeof comparison === "boolean"

        if (isBoolean && !comparison) {
            return this
        }

        if (!isBoolean && !comparison(this)) {
            return this
        }

        return this.$pipe(then)
    }

    /**
     * Returns a tuple separating the items that pass the given truth test.
     */
    $partition(callback: (item: T, index: number) => boolean) {
        const partitioned = this.constructor.from(Arr.partition(this, callback))
        return partitioned.map(item => this.constructor.from(item))
    }

    /**
     * Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.
     */
    $prepend(...items: T[]): Arrayable<T> {
        return this.constructor.from(Arr.prepend(this, ...items))
    }

    /**
     * Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.
     */
    $append(...items: T[]): Arrayable<T> {
        return this.constructor.from(Arr.append(this, ...items))
    }

    /**
     * Sorts an array in descending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
    $sortDesc(key?: string | number | ((item: T) => any)) {
        return this.constructor.from(Arr.sortDesc(this, key)) as Arrayable<T>
    }

    /**
     * Sorts an array in ascending order and **returns a new array**.
     * For array of objects: Pass index, field or callback to use it for sorting.
     */
    $sortAsc(key?: string | number | ((item: T, index: number) => any)) {
        return this.constructor.from(Arr.sortAsc(this, key)) as Arrayable<T>
    }

    /**
     * Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.
     */
    $toMap() {
        type Tuple = this[number]
        return new Mappable(this as unknown as Arrayable<[Tuple, Tuple]>)
    }
}

export default Arrayable
