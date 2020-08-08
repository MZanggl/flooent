/** Used to match words composed of alphanumeric characters. */
const splitWordRegex = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

export function splitWord(word): string[] {
  return word.match(splitWordRegex) || []
}
