/**
 * Returns number with ordinal suffix. Only supports English.
 */
export function ordinal(value: number) {
  const finalDigit = value.toString().slice(-1)
  return value.toString() + (["th", "st", "nd", "rd"][finalDigit] || "th")
}

/**
* Fills up the number with zeroes.
*/
export function pad(value: number, size: number) {
  let padded = value.toString()
  while (padded.length < size) padded = "0" + padded
  return padded
}


/**
 * Executes callback for number of base values' times and returns a flooent array with the result of each iteration.
 */
export function times<T = void>(length: number, callback: (index: number) => T) {
  return Array.from({ length }, (value, i) => callback(i))
}

/**
 * Check if the number is between two given numbers (Exclusive).
 */
export function isBetween(value: number, start: number, end: number) {
    return value > start && value < end
}

/**
 * Check if the number is between two given numbers (Inclusive).
 */
export function isBetweenOr(value: number, start: number, end: number) {
    return value >= start && value <= end
}

/**
 * Rounds down until .4 and up from .5.
 */
export function round(value: number) {
    return Math.round(value)
}

/**
 * Always rounds its value up to the next largest whole number or integer.
 */
export function ceil(value: number) {
    return Math.ceil(value)
}

/**
 * Always rounds its value down.
 */
export function floor(value: number) {
    return Math.floor(value)
}
