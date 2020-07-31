# flooent

Fluent interface to provide an expressive syntax for common manipulations.

Given you have logical, procedural, "hard to visualize" code like this:

```javascript
// given we have const path = 'App/Controllers/user.js'
const filename = path.substring(path.lastIndexOf('/') + 1)
let name = filename.substring(0, filename.lastIndexOf('.'))
if (!name.endsWith('Controller')) name+= 'Controller'
return name.substring(0, 1).toUpperCase() + name.substring(1)
```

refactor it into plain English

```javascript
// given we have const path = 'App/Controllers/user.js'
givenString(path)
  .betweenLast('/').andLast('.')
  .endWith('Controller')
  .capitalize()
```

## Index

- [Get Started](#get-started)
- [Arrays](#arrays)
- [String](#strings)
- [Maps](#maps)
- [Numbers](#numbers)
- [Macros (Extending flooent)](macros-extending-flooent)

## Get Started

### Installation

> `npm install flooent`

### given

Use `given` to create either a flooent Number, Array, Map or String depending on its type.

```javascript
import { givenString, givenArray, givenNumber, givenMap } from 'flooent'

givenString('hello') // instance of Stringable
givenArray([1, 2]) // instance of Arrayable
givenNumber(1) // instance of Numberable
givenMap({ key: 'value' }) // instance of Mappable (not object)
```

Flooent objects simply extend the native functionality, so you can still execute any native method like `givenString('hello').includes('h')`.

To turn flooent strings and numbers back into their respective primitive form, use `givenString('hello').valueOf()`.

`givenString` and `givenNumber` also accept a callback as the second argument which will automatically apply `valueOf()` at the end.

```javascript
const rawHelloWorld = givenString('hello', message => {
  return message.append(' world')
})
```

### Constraints

The contraints that apply to flooent strings and numbers are the same that apply to when you new up a native string/number using new (`new String('')`) and is just how JavaScript works.

For one, the type will be `object` instead of `string`.

```javascript
typeof givenString('') // object
typeof '' // string
```

Flooent strings and numbers are immutable. You can still do things like this:

```javascript
givenString('?') + '!' // '?!'
givenNumber(1) + 1 // 2
```

which will return a primitive (not an instance of flooent).

However you can not mutate flooent objects like this:

```javascript
givenString('') += '!' // ERROR
givenNumber(1) += 1 // ERROR
```

There are various fluent alternatives available.

## Arrays

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Array object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

#### is / quacksLike

Deep-compares the given value with the array

```javascript
const users = [{ id: 1 }]

givenArray(users).is([{ id: 1 }]) // true
```

#### mutate

Mutates the original array

```javascript
const numbers = givenArray(1, 2, 3)

numbers.mutate(n => n.append(4)) // [1, 2, 3, 4]
numbers  // [1, 2, 3, 4]
```

#### sum

Returns the sum of the array.

```javascript
givenArray([2, 2, 1]).sum() // 5
```

> See usage for [arrays of objects](#sum-1).

#### when

Executes callback if first given value evaluates to true. Result will get transformed back into a flooent array.

```javascript
// can be a boolean
givenArray([]).when(true, str => str.append(1)) // [1]
givenArray([]).when(false, str => str.append(1)) // []

// or a method
givenArray([]).when(array => array.is([]), array => array.append('called!')) // ['called']
givenArray([]).when(array => array.is([1]), array => array.append('called!')) // []
```

#### isEmpty

Returns a boolean whether the array is empty or not.

```javascript
givenArray([]).isEmpty() // true
givenArray([1]).isEmpty() // false
```

#### toMap

Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.

```javascript
givenMap({ key: 'value' }).entries().toMap()
```

### Fluent methods

#### where

Filters array by given value.

```javascript
const numbers = [1, 1, 2, 3]

givenArray(numbers).where(1) // [1, 1]
```

> See usage for [arrays of objects](#where-1).

#### whereIn

Filters array by given values.

```javascript
const numbers = [1, 1, 2, 3]

givenArray(numbers).whereIn([1, 3]) // [1, 1, 3]
```

> See usage for [arrays of objects](#wherein-1).

#### whereNot

Removes given value from array.

```javascript
const numbers = [1, 1, 2, 3]

givenArray(numbers).whereNot(1) // [2, 3]
```

> See usage for [arrays of objects](#wherenot-1).

#### whereNotIn

Removes given values from array.

```javascript
const numbers = [1, 1, 2, 3]

givenArray(numbers).whereNotIn([2, 3]) // [1, 1]
```

> See usage for [arrays of objects](#wherenotin-1).

#### first

Returns first (x) element(s) in array or undefined.

```javascript
givenArray([1, 2, 3]).first() // 1
givenArray([1, 2, 3]).first(2) // [1, 2]
```

#### second

Returns second element in array or undefined.

```javascript
givenArray([1, 2, 3]).second() // 2
```

#### last

Returns last (x) element(s) in array or undefined.

```javascript
givenArray([1, 2, 3]).last() // 3
givenArray([1, 2, 3]).last(2) // [2, 3]
```

Alternatively, pass in a callback to get the last item that passes the given truth test (inverse of `find`).

```javascript
givenArray([1, 2, 3]).last(item => item > 1) // 3
```

#### nth

Returns element at given index or undefined. If given value is negative, it searches from behind.

```javascript
givenArray(['a', 'b', 'c']).nth(1) // 'b'
givenArray(['a', 'b', 'c']).nth(5) // undefined
givenArray(['a', 'b', 'c']).nth(-1) // 'c'
```

### until

Returns the items until either the given value is found, or the given callback returns `true`.

```javascript
givenArray(['a', 'b', 'c']).until('c') // ['a', 'b']
givenArray(['a', 'b', 'c']).until(item => item === 'c') // ['a', 'b']
```

#### shuffle

Shuffles the array.

```javascript
givenArray([1, 2, 3]).shuffle() // ?, maybe: [1, 3, 2]
```

#### unique

Returns array of unique values.

```javascript
givenArray([1, 1, 2]).unique() // [1, 2]
```

> See usage for [arrays of objects](#unique-1).

### chunk

Breaks the array into multiple, smaller arrays of a given size:

```javascript
givenArray([1, 2, 3, 4, 5]).chunk(3) // [[1, 2, 3], [4, 5]]
```

### forPage

Returns the items for the given page and size.

```javascript
givenArray(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(1, 3) // ['a', 'b', 'c']
givenArray(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(2, 3) // ['d', 'e', 'f']
givenArray(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(3, 3) // ['g']
givenArray(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(4, 3) // []
```

### pad

Fills up the array with the given value.

```javascript
givenArray([1, 2, 3]).pad(5, 0) // [1, 2, 3, 0, 0]
```

#### filled

Only returns items which are not empty.

```javascript
givenArray([0, '', null, undefined, 1, 2]).filled() // [1, 2]
```

> See usage for [arrays of objects](#filled-1).

#### partition

Returns a tuple separating the items that pass the given truth test.

```javascript
const users = givenArray([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: true }])

const [activeUsers, inactiveUsers] = users.partition(user => user.active)
```

#### prepend

Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.

```javascript
const numbers = givenArray([2, 3])
numbers.prepend(0, 1) // [0, 1, 2, 3]
```

To prepend items at a specific index, check out the [Pointer API](#pointer-api).

#### append

Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.

```javascript
const numbers = givenArray([0, 1])
numbers.append(2, 3) // [0, 1, 2, 3]
```

To append items at a specific index, check out the [Pointer API](#pointer-api).

#### sortAsc / sortDesc

Sorts an array in their respective order and **returns a new array**.

```javascript
givenArray([3, 1, 2]).sortAsc() // [1, 2, 3]
givenArray([3, 1, 2]).sortDesc() // [3, 2, 1]
```

> See usage for [arrays of objects](#sortasc--sortdesc-1).

#### pipe

Executes callback and transforms result back into a flooent array.

```javascript
const someMethodToBePipedThrough = array => array.append(1)

givenArray([]).pipe(someMethodToBePipedThrough) // [1]
```

#### tap

Tap into the chain without modifying the array.

```javascript
givenArray([])
  .append(1)
  .tap(array => console.log(array))
  .append(2)
  // ...
```

#### clone

Deep clones an array.

```javascript
const items = [{ id: 1, name: 'music' }]
const clone = givenArray(items).clone() // [{ id: 1, name: 'music' }]
console.log(items[0] === clone[0]) // false
```

### Pointer API

Let's you point to a specific index inside the array to do further actions on it.

```javascript
givenArray(['music', 'video', 'tech']).at(1) // returns pointer pointing to 'video'
givenArray(['music', 'video', 'tech']).at(-1) // returns pointer pointing to 'tech'
givenArray(['music', 'video', 'tech']).at(item => item === 'music') // returns pointer pointing to 'music'
```

#### append

Appends given value to array in between the currently pointed item and its next item and returns a new array.

```javascript
givenArray(['music', 'tech']).at(0).append('video') // ['music', 'video', 'tech']
```

#### prepend

Prepends given value to array in between the currently pointed item and its previous item and returns a new array.

```javascript
givenArray(['music', 'tech']).at(1).prepend('video') // ['music', 'video', 'tech']
```

#### set

Sets the value at the current index and returns a new array.

```javascript
givenArray(['music', 'tec']).at(1).set(item => item + 'h') // ['music', 'tech']
```

### Methods for arrays of objects

#### sum

Returns the sum of the given field/result of callback in the array.

```javascript
  const users = [{ id: 1, points: 10 }, { id: 2, points: 10 }, { id: 3, points: 10 }]

  givenArray(users).sum('points') // 30
  givenArray(users).sum(user => user.points * 10) // 300
```

#### sortAsc / sortDesc

Sorts an array in their respective order and **returns a new array**.

```javascript
const numbers = [{ val: 3 }, { val: 1 }, { val: 2 }]
givenArray(numbers).sortAsc('val') // [{ val: 1 }, { val: 2 }, { val: 3 }]
givenArray(numbers).sortDesc('val') // [{ val: 3 }, { val: 2 }, { val: 1 }]
```

Also works by passing the index (useful when working with array entries).

```javascript
givenArray([[0], [2], [1]]).sortAsc(0)) // [[0], [1], [2]])
```

Alternatively, pass in a map function of which its result will become the key instead.

```javascript
const numbers = [{ val: 3 }, { val: 1 }, { val: 2 }]
givenArray(numbers).sortAsc(item => item.val) // [{ val: 1 }, { val: 2 }, { val: 3 }]
givenArray(numbers).sortDesc(item => item.val) // [{ val: 3 }, { val: 2 }, { val: 1 }]
```

#### pluck

Pluck given field out an object of arrays.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
]

givenArray(cities).pluck('name') // ['Munich', 'Naha']
```

#### where

Filters array by given key / value pair.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Naha' },
]

givenArray(cities).where('name', 'Munich') // [{ id: 1, name: 'Munich' }]
```

#### whereNot

Removes items from array by the given key / value pair.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Naha' },
]

givenArray(cities).whereNot('name', 'Naha') // [{ id: 1, name: 'Munich' }]
```

#### whereIn

Filters array by given key and values.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Yoron' },
]

givenArray(cities).whereIn('name', ['Munich', 'Yoron']) // [{ id: 1, name: 'Munich' }, { id: 3, name: 'Yoron' }]
```

#### whereNotIn

Removes items from array by the given key and values.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Yoron' },
]

givenArray(cities).whereNotIn('name', ['Naha', 'Yoron']) // [{ id: 1, name: 'Munich' }]
```

#### omit

Omits given keys from objects in the array.

```javascript
const people = [
  { id: 1, age: 24, initials: 'mz' },
  { id: 2, age: 2, initials: 'lz' }
]

givenArray(people).omit(['initials', 'age']) // [ { id: 1 }, { id: 2 } ])
```

#### unique

Returns array of unique values comparing the given key.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 1, name: 'music' }]
givenArray(items).unique('id') // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

Alternatively, pass in a function of which its result will become the key instead.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: 'MUSIC' }]
givenArray(items).unique(item => item.name.toLowerCase()) // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

#### filled

Only returns items which the value of the given key is not empty.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: '' }]
givenArray(items).filled('name') // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

#### groupBy

Groups an array by the given key and returns a flooent map

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: 'music' }]
givenArray(items).groupBy('name') // result is:
/*
{
  music: [{ id: 1, name: 'music' }, { id: 3, name: 'music' }],
  movie: [{ id: 2, name: 'movie' }]
}
*/
```

Alternatively, pass in a function of which its result will become the key instead.

```javascript
const items = [{ id: 1, name: 'Music' }, { id: 2, name: 'movie' }, { id: 3, name: 'music' }]
givenArray(items).groupBy(item => item.name.toUpperCase()) // result is:
/*
{
  MUSIC: [{ id: 1, name: 'music' }, { id: 3, name: 'music' }],
  MOVIE: [{ id: 2, name: 'movie' }]
}
*/
```

## Strings

<small>

[Back to top](#index)

</small>

You have access to [everything from the native String object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).

#### is

Compares given value with the raw string.

```javascript
givenString('flooent').is('flooent') // true
```

#### includedIn

Checks if string is included in the given array.

```javascript
givenString('flooent').includedIn(['flooent', 'string'])
```

### Fluent methods

#### after

Returns the remaining text after the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
givenString('sub.domain.com').after('.') // String { 'domain.com' }
```

#### afterLast

Returns the remaining text after the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
givenString('sub.domain.com').afterLast('.') // String { 'com' }
```

#### before

Returns the text before the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
givenString('sub.domain.com').before('.') // String { 'sub' }
```

#### beforeLast

Returns the text before the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
givenString('sub.domain.com').beforeLast('.') // String { 'sub.domain' }
```

#### between

Returns the text between two given values.

```javascript
givenString('some@email.com').between('@').and('.') // String { 'email' }
givenString('some@sub.email.com').between('@').andLast('.') // String { 'sub.email' }
```

#### betweenLast

Returns the text between the last occurrence of given value and second function respectively.

```javascript
givenString('john.doe@email.com:123456').betweenLast('.').and(':') // String { 'com' }
givenString('App/Models/payment.method.js').betweenLast('/').andLast('.') // String { 'payment.method' }
```

#### append

Alias for `concat`. Appends given value to string.

```javascript
givenString('hello').append(' world') // String { 'hello world' }
```

#### prepend

Prepends given value to string.

```javascript
givenString('world').prepend('hello ') // String { 'hello world' }
```

#### endWith

Appends given value only if string doesn't already end with it.

```javascript
givenString('hello').endWith(' world') // String { 'hello world' }
givenString('hello world').endWith(' world') // String { 'hello world' }
```

#### startWith

Prepends given value only if string doesn't already start with it.

```javascript
givenString('world').startWith('hello ') // String { 'hello world' }
givenString('hello world').startWith('hello ') // String { 'hello world' }
```

#### limit

Truncates text to given length and appends second argument if string got truncated.

```javascript
givenString('The quick brown fox jumps over the lazy dog').limit(9) // The quick...
givenString('The quick brown fox jumps over the lazy dog').limit(9, ' (Read more)') // The quick (Read more)
givenString('Hello').limit(10) // Hello
```

#### pipe

Executes callback and transforms result back into a flooent string.

```javascript
givenString('').pipe(str => str.append('!')) // String { '!' }
```

#### tap

Tap into the chain without modifying the string.

```javascript
givenString('')
  .append('!')
  .tap(str => console.log(str))
  .append('!')
  // ...
```

#### when

Executes callback if first given value evaluates to true. Result will get transformed back into a flooent string.

```javascript
// can be a boolean
givenString('').when(true, str => str.append('!')) // String { '!' }
givenString('').when(false, str => str.append('!')) // String { '' }

// or a method
givenString('hello').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello world' }
givenString('hi').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello' }
```

#### whenEmpty

Executes callback if string is empty. Result will get transformed back into a flooent string.

```javascript
givenString('').whenEmpty(str => str.append('!')) // String { '!' }
givenString('hello').whenEmpty(str => str.append('!')) // String { 'hello' }
```

#### wrap

Wraps a string with given value.

```javascript
givenString('others').wrap('***') // String { '***others***' }
givenString('oldschool').wrap('<blink>', '</blink>') // String { '<blink>oldschool</blink>' }
```

#### unwrap

Unwraps a string with given value.


```javascript
givenString('***others***').unwrap('***') // String { 'others' }
givenString('<blink>oldschool</blink>').unwrap('<blink>', '</blink>') // String { 'oldschool' }
```

#### title

Turns string into title case.

```javascript
givenString('foo bar').title() // String { 'Foo Bar' }
```

#### capitalize

Capitalizes first character.

```javascript
givenString('foo bar').capitalize() // String { 'Foo bar' }
```

#### slug

Turns string into URL friendly slug.

```javascript
givenString('Foo Bar').slug() // String { 'foo-bar' }
givenString('foo bar').slug('+') // String { 'foo+bar' }
```

#### parse

Parses a string back into its original form.

```javascript
givenString('true').parse() // true
givenString('23').parse() // 23
givenString('{\"a\":1}').parse() // { a: 1 }
```

## Maps

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

The native methods `keys()`, `entries()` and `values()` will return an instance of flooent Array instead of a native Array.

> For nested data structures, only the first layer gets transformed into a map

#### toJSON

Turns the map back into an object.

```javascript
const map = givenMap({ key: 'value' }) // Map { key → "value" }
map.toJSON() // { key: 'value' }
```

#### pull

Returns the value for the given key and deletes the key value pair from the map (mutation).

```javascript
const map = givenMap({ key: 'value' })
map.pull('key') // 'value'
map.has('key') // false
```

#### mapKeys

Iterates the entries through the given callback and assigns each result as the key.

```javascript
const map = givenMap({ a: 1 }).mapKeys((value, key) => key + value)

map.get('a1') // 1
```

#### mapValues

Iterates the entries through the given callback and assigns each result as the value.

```javascript
const map = givenMap({ a: '1' }).mapValues((value, key) => key + value)

map.get('a') // a1
```

#### only

Returns a new map with only the given keys.

```javascript
  givenMap({ one: 1, two: 2, three: 3 }).only(['one', 'two']) // Map { "one" → 1, "two" → 2 }
```

#### except

Inverse of `only`. Returns a new map with all keys except for the given keys.

```javascript
  givenMap({ one: 1, two: 2, three: 3 }).except(['one', 'two']) // Map { "three" → 3 }
```

#### clone

Deep clones a map.

```javascript
const map = givenMap({ numbers: [1, 2, 3] })
const clone = map.clone()
console.log(map.get('numbers') === clone.get('numbers')) // false
```

#### arrange

Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.

```javascript
givenMap({ strings: 2, numbers: 1, functions: 4 })
  .arrange('numbers', 'functions')
  .keys() // ['numbers', 'functions', 'strings']
```

## Numbers

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Number object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).

#### times

Executes callback for number of base values' times and returns an array with the result of each iteration.

```javascript
givenNumber(3).times(i => i) // [0, 1, 2]
```

#### pad

Fills up the number with zeroes.

```javascript
givenNumber(40).pad(4) // '0040'
```

#### ordinal

Returns number with ordinal suffix. Only supports English.

```javascript
givenNumber(1).ordinal() // '1st'
givenNumber(9).ordinal() // '9th'
```

### isBetween / isBetweenOr

Check if the number is between two given numbers. `isBetweenOr` is inclusive, while `isBetween` is exclusive.

```javascript
givenNumber(5).isBetween(1, 10) // true
givenNumber(5).isBetween(5, 10) // false
givenNumber(5).isBetweenOr(5, 10) // true
```

### Fluent methods

#### Working with percentages

```javascript
givenNumber(40).percent().of(750) // Number { 300 }

givenNumber(300).of(750).inPercent() // Number { 40 }
```

#### round

Rounds down until .4 and up from .5.

```javascript
givenNumber(10.4).round() // Number { 10 }
givenNumber(10.5).round() // Number { 11 }
```

#### ceil

Always rounds its value up to the next largest whole number or integer.

```javascript
givenNumber(10.2).ceil() // Number { 11 }
```

#### floor

Always rounds its value down.

```javascript
givenNumber(10.9).floor() // Number { 10 }
```

## Macros (extending flooent)

<small>

[Back to top](#index)

</small>

Extending flooent's method is easy as pie thanks to `macro`.

```javascript
import { givenString } from 'flooent'

givenString.macro('scream', function() {
  return this.toUpperCase()
})

givenString('hello').scream() // String { 'HELLO' }
```

Define macros at a central place before your business logic. E.g. entry point or service provider

### TypeScript

For TypeScript support, you need to additionally declare the module.

```typescript
declare module 'flooent' {
  interface Stringable {
    scream: () => Stringable;
  }
}
```

### Common Macros

These methods, while convenient, are not in the library by default to keep the bundle size small.

## `String.plural` and `String.singular`

```javascript
import { givenString } from 'flooent'
import pluralize from 'pluralize' // npm install pluralize

givenString.macro('plural', function(count) {
  return new this.constructor(pluralize(this, count, false))
})

givenString.macro('singular', function() {
  return new this.constructor(singular(this))
})
```

Then, use it like this:

```javascript
givenString('child').plural() // String { 'children' }
givenString('child').plural(3) // String { 'children' }
givenString('child').plural(1) // String { 'child' }

givenString('children').singular() // String { 'child' }
givenString('child').singular() // String { 'child' }
```

## `String.case`

```javascript
import { givenString } from 'flooent'
import camelcase from "lodash.camelcase" // npm install lodash.camelcase
import kebabcase from "lodash.kebabcase" // npm install lodash.kebabcase
import snakecase from "lodash.snakecase" // npm install lodash.snakecase

givenString.macro('case', function(type) {
  if (type === 'camel') {
    return new this.constructor(camelcase(this))
  } else if (type === 'kebab') {
    return new this.constructor(kebabcase(this))
  } else if (type === 'snake') {
    return new this.constructor(snakecase(this))
  } else if (type === 'studly') {
    return new this.constructor(camelcase(this.capitalize()))
  }
  throw new Error('unknown type passed')
})
```

Then use it like this:

```javascript
givenString('foo bar').case('camel') // String { 'fooBar' }
givenString('foo bar').case('kebab') // String { 'foo-bar' }
givenString('foo bar').case('snake') // String { 'foo_bar' }
givenString('foo bar').case('studly') // String { 'FooBar' }
```