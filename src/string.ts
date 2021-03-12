import { splitWord } from './utils'

/**
 * Returns the remaining text after the first occurrence of the given value.
 * If the value does not exist in the string, the entire string is returned unchanged.
 */
export function after<T extends String>(value: T, part: string): T
export function after<T extends string>(value: T, part: string) {
    const index = value.indexOf(part)
    if (index === -1) {
        return value
    }
    return value.slice(index + part.length)
}

/**
 * Returns the remaining text after the last occurrence of the given value.
 * If the value does not exist in the string, the entire string is returned unchanged.
 */
export function afterLast<T extends String>(value: T, part: string): T
export function afterLast<T extends string>(value: T, part: string) {
    const index = value.lastIndexOf(part)
    if (index === -1) {
        return value
    }
    return value.slice(index + part.length)
}

/**
 * Returns the text before the first occurrence of the given value.
 * If the value does not exist in the string, the entire string is returned unchanged.
 */
export function before<T extends String>(value: T, part: string): T
export function before<T extends string>(value: T, part: string) {
    const index = value.indexOf(part)
    if (index === -1) {
        return value
    }
    return value.slice(0, index) as unknown
}

/**
 * Returns the text before the last occurrence of the given value.
 * If the value does not exist in the string, the entire string is returned unchanged.
 */
export function beforeLast<T extends String>(value: T, part: string): T
export function beforeLast<T extends string>(value: T, part: string) {
    const index = value.lastIndexOf(part)
    if (index === -1) {
        return value
    }
    return value.slice(0, index)
}

/**
 * Wraps a string with the given value.
 */
export function wrap(value: string, start: string, end = start) {
    return start + value + end
}

/**
 * Unwraps a string with the given value.
 */
export function unwrap<T extends String>(value: T, start: string, end?: string): T
export function unwrap<T extends string>(value: T, start: string, end = start) {
    if (value.startsWith(start)) value = after(value, start)
    if (value.endsWith(end)) value = beforeLast(value, end)
    return value
}

/**
 * Alias for `concat`. Appends the given value to string.
 */
export function append<T extends String>(value: T, part: string): T
export function append<T extends string>(value: T, part: string) {
    return value.concat(part)
}

/**
 * Prepends the given value to string.
 */
export function prepend(value: string, part: string) {
    return part + value
}

/**
 * Checks if the string is included in the given array.
 */
export function includedIn(value: string, array: string[]) {
    return array.indexOf(value) >= 0
}

/**
 * Appends the given value only if string doesn't already end with it.
 */
export function endWith<T extends String>(value: T, part: string): T
export function endWith<T extends string>(value: T, part: string) {
    if (value.endsWith(part)) {
        return value
    } else {
        return append(value, part)
    }
}

/**
 * Prepends the given value only if string doesn't already start with it.
 */
export function startWith<T extends String>(value: T, part: string): string
export function startWith<T extends string>(value: T, part: string) {
    if (value.startsWith(part)) {
        return value
    } else {
        return part + value
    }
}

/**
 * Truncates text to given length and appends second argument if string got truncated.
 */
export function limit<T extends String>(value: T, n: number, append?: string): T
export function limit<T extends string>(value: T, n: number, append = "...") {
    let truncated = value.slice(0, n)
    if (value.length > n) {
        return truncated.concat(append)
    }
    return truncated
}

/**
 * Turns the string into title case.
 */
export function title<T extends String>(value: T): string
export function title<T extends string>(value: T) {
    const words = splitWord(value).map(word => word.substring(0, 1).toUpperCase() + word.substring(1))
    return words.join(' ')
}

/**
 * Turns the string into kebab case.
 */
export function kebab<T extends String>(value: T): string
export function kebab<T extends string>(value: T) {
    return snake(value, '-')
}

/**
 * Turns the string into snake case.
 */
export function snake<T extends String>(value: T, replacement?: string): string
export function snake<T extends string>(value: T, replacement = '_') {
    return splitWord(value).join(replacement).toLowerCase()
}

/**
 * Turns the string into studly case.
 */
export function studly<T extends String>(value: T): string
export function studly<T extends string>(value: T) {
    const words = splitWord(value).map(word => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
    return words.join('')
}

/**
 * Turns the string into camel case.
 */
export function camel<T extends String>(value: T): string
export function camel<T extends string>(value: T) {
    const studlyCased = studly(value)
    if (studlyCased.length === 0) return studlyCased
    return studlyCased[0].toLowerCase() + studlyCased.substring(1)
}

/**
 * Capitalizes the first character.
 */
export function capitalize<T extends String>(value: T): string
export function capitalize<T extends string>(value: T) {
    if (value.length === 0) return value
    return value[0].toUpperCase() + value.substring(1)
}

/**
 * Turns the string into URI conform slug.
 */
export function slug<T extends String>(value: T, replacement?: string): string
export function slug<T extends string>(value: T, replacement = "-") {
    const slug = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // e.g. è -> e
        .replace(/[^a-zA-Z0-9\s]/g, "") // only keep numbers and alphabet

    return snake(slug, replacement)
}

/**
 * Parses a string back into its original form. Examples:
 * given.string('true').parse() // true
 * given.string('23').parse() // 23
 */
export function parse<T extends String>(value: T)
export function parse<T extends string>(value: T) {
    return JSON.parse(value)
}
