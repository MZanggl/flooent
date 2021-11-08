import { getNthIndex } from './utils'

interface ArrayConstructor<T> extends Function {
    from: (value: T[]) => T[]
}

/**
 * Returns the first (x) element(s) in the array or undefined.
 */
export function first<T>(value: T[], count?: number) {
    if (count) {
        return value.slice(0, count)
    }

    return value[0]
}

/**
 * Returns the second element in the array or undefined.
 */
export function second<T>(value: T[]) {
    return value[1]
}

/**
 * Returns last (x) element(s) in array or undefined.
 * Alternatively, pass in a callback to get the last item that passes the given truth test (inverse of `find`).
 */
export function last<T>(value: T[], countOrFn?: number | ((value: any) => any[])) {
    if (typeof countOrFn === 'number') {
        return value.slice(value.length - countOrFn)
    } else if (typeof countOrFn === 'function') {
        const filteredItems = value.filter(countOrFn)
        return filteredItems[filteredItems.length - 1]
    }

    return value[value.length - 1]
}

export function isEmpty<T>(value: T[]) {
    return value.length === 0
}

/**
 * Returns element at given index or undefined. If given value is negative, it searches from behind.
 */
export function nth<T>(value: T[], index: number) {
    return value[getNthIndex(value, index)]
}

/**
 * Returns the items until either the given value is found, or the given callback returns `true`.
 */
export function until<T>(value: T[], comparison) {
    const newArray = []
    for (const item of value) {
      const reachedEnd = (typeof comparison === "function" && comparison(item)) || item === comparison
      if (reachedEnd) {
        break
      }
      newArray.push(item)
    }
    return newArray
}

/**
 * Return all items that don't pass the given truth test. Inverse of `Array.filter`.
 */
export function reject<T>(value: T[], callback: (item: T, index?: number) => boolean) {
    return value.filter((item, index) => !callback(item, index))
}

/**
 * Moves an item in the array using the given source index to either "before" or "after" the given target.
 */
export function move<T>(value: T[], source: number, position: 'before' | 'after', target: number) {
    if (source === target) {
        return value
    }
    
    const comparison = position === 'before' ? (_, index) => index < target : (_, index) => index <= target
    const [before, after] = partition(value, comparison)
    
    const result = before.concat(value[source], ...after)
    const newSourceIndex = source > target ? source + 1 : source
    result.splice(newSourceIndex, 1)
    return result
}

/**
 * Breaks the array into multiple, smaller arrays of a given size.
 */
export function chunk<T>(value: T[], n) {
    const remaining = [...value]
    const chunks = []
    while (remaining.length > 0) {
        chunks.push(remaining.splice(0, n))
    }
    return chunks
}

/**
 * Returns the items for the given page and size.
 */
export function forPage<T>(value: T[], page: number, size: number) {
    const from = ((page - 1) * size)
    return value.slice(from, from + size)
}

/**
 * Fills up the array with the given value.
 */
export function pad<T>(value: T[], size: number, paddedValue: T) {
    const copy = (value.constructor as ArrayConstructor<T>).from(value)
    while (copy.length < size) copy.push(paddedValue)
    return copy
}

/**
 * Points to a specific index inside the array to do further actions on it.
 */
export function point<T>(value: T[], indexOrFn: number | ((item: T) => boolean)) {
    const index = getNthIndex(value, indexOrFn)

    const array = value
    const pointer = {
        /**
         * Sets the value at the current index and returns a new array.
         */
        set(callback: (item: T) => T) {
            const copy = Array.from(array)
            copy[index] = callback(copy[index])
            return copy
        },
        /**
         * Appends given value to array in between the currently pointed item and its next item and returns a new array.
         */
        append(...items: T[]) {
            const [before, after] = partition(array, (item, i) => i <= index)
            return [...before, ...items, ...after]
        },
        /**
         * Prepends given value to array in between the currently pointed item and its previous item and returns a new array.
         */
        prepend(...items: T[]) {
            const [before, after] = partition(array, (item, i) => i < index)
            return [...before, ...items, ...after]
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
            return point(array, index + steps)
        }
    }

    return pointer
}

/**
 * @deprecated Alias for point
 */
export const at = point

/**
 * Filters array by given value or key/value pair.
 */
export function where<T>(array: T[], keyOrValue, value) {
    if (value === undefined) {
        return array.filter((item) => item === keyOrValue)
    }

    return array.filter((item) => item[keyOrValue] === value)
}

/**
 * Removes items from array by the given key or key/value pair.
 */
export function whereNot<T>(array: T[], keyOrValue, value) {
    if (value === undefined) {
        return array.filter((item) => item !== keyOrValue)
    }

    return array.filter((item) => item[keyOrValue] !== value)
}

/**
 * Filters array by given values or key/values pair.
 */
export function whereIn<T>(array: T[], keyOrValue, value) {
    if (value === undefined) {
        return array.filter((item) => keyOrValue.includes(item))
    }

    return array.filter((item) => value.includes(item[keyOrValue]))
}

/**
 * Removes items from array by the given value or key/values pair.
 */
export function whereNotIn<T>(array: T[], keyOrValue, value) {
    if (value === undefined) {
        return array.filter((item) => !keyOrValue.includes(item))
    }

    return array.filter((item) => !value.includes(item[keyOrValue]))
}

/**
 * Only returns items which are not empty.
 */
export function filled<T>(value: T[], key?: string) {
    if (!key) {
        return value.filter((value) => !!value)
    }

    return value.filter((item) => !!item[key])
}

/**
 * Mutates the original array with the return value of the given callback.
 */
export function mutate<T>(value: T[], callback: ((array: T[]) => T[])) {
    const mutation = callback(value)
    value.splice(0)
    value.splice(0, 0, ...mutation)
    return value
}

/**
 * Groups an array by the given key and returns a flooent map.
 */
export function groupBy<T, K extends keyof T>(value: T[], key: K | ((item: T) => T[K]) ) {
    return value.reduce<Map<T[K], T[]>>((result, item) => {
        const group = typeof key === "function" ? key(item) : item[key]
        if (result.has(group)) {
            result.get(group).push(item)
        } else {
            result.set(group, (value.constructor as ArrayConstructor<T>).from([item]))
        }
        return result
    }, new Map<T[K], T[]>())
}

/**
 * Returns the sum of the array.
 * For arrays of objects: Pass field or callback as argument.
 */
export function sum<T>(value: T[], key?: string | ((item: T) => number)) {
    return value.reduce<number>((result, item) => {
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
export function omit<T>(value: T[], keys: string[]) {
    return (value as unknown as Object[]).map((item) => {
        const copy = {...item}
        keys.forEach(key => delete copy[key])
        return copy
    }) as T[]
}

/**
 * Pluck the given field out of each object in the array.
 */
export function pluck<T>(value: T[], key: keyof T) {
    return value.map((item) => item[key]) as T[keyof T][]
}

/**
 * Returns array of unique values.
 * For array ob objects: Pass key or callback to use it for the comparison.
 */
export function unique<T>(value: T[], key?: string | ((item: T) => string)) {
    if (!key) {
        return [...new Set(value)]
    }

    const cache = new Map()
    const unique = []
    if (typeof key === "function") {
        for (const item of value) {
            const value = key(item)
            if (!cache.has(value)) {
                cache.set(value, 1)
                unique.push(item)
            }
        }
        return unique
    }

    for (const item of value) {
        if (cache.has(item[key])) continue
        cache.set(item[key], 1)
        unique.push(item)
    }
    return unique
}

/**
 * Shuffles and returns a new array.
 */
export function shuffle<T>(value: T[]) {
    const array = (value.constructor as ArrayConstructor<T>).from(value)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

/**
 * Returns a tuple separating the items that pass the given truth test.
 */
export function partition<T>(value: T[], callback: Function) {
    const tuple = [[], []] as [T[], T[]]

    value.forEach((item, index) => {
        const tupleIndex = callback(item, index) ? 0 : 1
        tuple[tupleIndex].push(item)
    })

    return tuple
}

/**
 * Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.
 */
export function prepend<T>(value: T[], ...items: T[]): T[] {
    return [...items, ...value]
}

/**
 * Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.
 */
export function append<T>(value: T[], ...items: T[]): T[] {
    return [...value, ...items]
}

/**
 * Sorts an array in descending order and **returns a new array**.
 * For array of objects: Pass index, field or callback to use it for sorting.
 */
export function sortDesc<T>(value: T[], key?: string | number | ((item: T) => any)) {
    return sortAsc(value, key).reverse()
}

/**
 * Sorts an array in ascending order and **returns a new array**.
 * For array of objects: Pass index, field or callback to use it for sorting.
 */
export function sortAsc<T>(value: T[], key?: string | number | ((item: T, index: number) => any)) {
    if (!key) {
        return [...value].sort()
    }

    if (typeof key === 'function') {
        return value.map((item, index) => {
            return { sortKey: key(item, index), item }
        })
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(item => item.item)
    }
    
    return [...value].sort((a, b) => a[key] - b[key])
}

/**
 * Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.
 */
export function toMap<T>(value: T[]) {
    return new Map(value as any)
}
