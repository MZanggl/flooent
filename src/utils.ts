/** Used to match words composed of alphanumeric characters. */
const splitWordRegex = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

export function splitWord(word): string[] {
  return word.match(splitWordRegex) || []
}

export function getNthIndex<T>(array: T[], indexOrFn: number | ((item: T) => boolean)) {
  if (typeof indexOrFn === 'function') {
    return array.findIndex(indexOrFn)
  }
  if (indexOrFn < 0) {
    return array.length + indexOrFn
  }
  return indexOrFn
}