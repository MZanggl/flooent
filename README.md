# flooent

![npm bundle size](https://badgen.net/bundlephobia/minzip/flooent)
![latest version](https://badgen.net/npm/v/flooent?icon=npm&label=)
[![Coverage Status](https://coveralls.io/repos/github/MZanggl/flooent/badge.svg?branch=2.0)](https://coveralls.io/github/MZanggl/flooent?branch=2.0)

Fluent interface to provide an **expressive syntax** for common manipulations.
Rather than enforcing a different paradigm, flooent **builds upon and extends the native capabilities** of various JavaScript objects.

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
given.string(path)
  .afterLast('/')
  .beforeLast('.')
  .endWith('Controller')
  .capitalize()
  .valueOf()
```

[Try it out online!](https://codesandbox.io/s/flooent-28fkv?file=/src/index.js)

## Index

- [Get Started](#get-started)
- [Constraints](#constraints)
- [Strings](#strings)
- [Arrays](#arrays)
- [Maps](#maps)
- [Numbers](#numbers)
- [Any](#any)
- [Macros (Extending flooent)](#macros-extending-flooent)

## Get Started

[Migration from Version 1 to Version 2](https://github.com/MZanggl/flooent/releases/tag/v2.0.0)

[Documentation and Code for Version 1](https://github.com/MZanggl/flooent/tree/v1-latest)

### Installation

> `npm install flooent`

### given

Use `given` to create either a flooent Number, Array, Map or String.

```javascript
import { given } from 'flooent'

given.string('hello') // instance of Stringable
given.array([1, 2]) // instance of Arrayable
given.number(1) // instance of Numberable
given.map({ key: 'value' }) // or given.map([['key', 'value']]), or given.map(new Map(...)) | instance of Mappable
given.any('anything') // helper class with useful methods for any data type
```

Flooent objects only extend the native functionality, so you can still execute any native method like `given.string('hello').includes('h')`.

To turn flooent objects back into their respective primitive form, use the `valueOf()` method.

```javascript
given.string('hello').valueOf()
```

When newing up a flooent object, you can also provide a callback as the second argument which will automatically turn the object back into its primitive form.

```javascript
const shuffledNumbersRaw = given.array([1, 2, 3, 4], numbers => {
  return numbers.shuffle()
})
```

## Best Practices

After performing your data manipulations, if you need to use this data further, turn it back into its primitive form (see above) instead of passing it as an argument to another function or returning it.

This is to avoid cases such as flooent having a method (e.g. array.at) that later gets added to native JavaScript with different behaviour. That other function is not expecting a flooent object (specifically a third-party lib) and could make use of the `at` method.

## Constraints

<small>

[Back to top](#index)

</small>

The contraints that apply to flooent strings and numbers are the same that apply to when you new up a native string/number using new (`new String('')`) and is just how JavaScript works.

For one, the type will be `object` instead of `string`.

```javascript
typeof given.string('') // object
typeof '' // string
```

Flooent strings and numbers are immutable. You can still do things like this:

```javascript
given.string('?') + '!' // '?!'
given.number(1) + 1 // 2
```

which will return a primitive (not an instance of flooent).

However you can not mutate flooent objects like this:

```javascript
given.string('') += '!' // ERROR
given.number(1) += 1 // ERROR
```

There are various fluent alternatives available.

## Functional API

If you only need to do a single thing, you can also import most functions individually. The result of these functions will not be turned into a flooent object.

```javascript
import { afterLast } from 'flooent/string'
afterLast('www.example.com', '.') // 'com'

import { move } from 'flooent/array'
move(['music', 'tech', 'sports'], 0, 'after', 1) // ['tech', 'music', 'sports']

import { times } from 'flooent/number'
times(3, i => i) // [0, 1, 2]

import { rename } from 'flooent/map'
rename(new Map([['item_id', 1]]), 'item_id', 'itemId') // Map { itemId → 1 }
```

In addition, there is an experimental API for a pipable API:

```javascript
import { pipe, afterLast, beforeLast, endWith, capitalize } from 'flooent/fp/string'

const path = 'App/Controllers/user.js'
pipe(path, afterLast('/'), beforeLast('.'), endWith('Controller'), capitalize) // UserController
```

Note: `flooent/fp/string`, `flooent/fp/map`, `flooent/fp/number`, and `flooent/fp/array` all return the same function `pipe`.

## Strings

<small>

[Back to top](#index)

</small>

You have access to [everything from the native String object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).

#### pipe

<!-- string.pipe -->
Executes the callback and transforms the result back into a flooent string if it is a string.
<!-- end -->

```javascript
given.string('').pipe(str => str.append('!')) // String { '!' }
```

#### is

<!-- string.is -->
Compares the given value with the raw string.
<!-- end -->

```javascript
given.string('flooent').is('flooent') // true
```

#### includedIn

<!-- string.includedIn -->
Checks if the string is included in the given array.
<!-- end -->

```javascript
given.string('flooent').includedIn(['flooent', 'string'])
```

### Fluent methods

#### after

<!-- string.after -->
Returns the remaining text after the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.
<!-- end -->

```javascript
given.string('sub.domain.com').after('.') // String { 'domain.com' }
```

#### afterLast

<!-- string.afterLast -->
Returns the remaining text after the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.
<!-- end -->

```javascript
given.string('sub.domain.com').afterLast('.') // String { 'com' }
```

#### before

<!-- string.before -->
Returns the text before the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.
<!-- end -->

```javascript
given.string('sub.domain.com').before('.') // String { 'sub' }
```

#### beforeLast

<!-- string.beforeLast -->
Returns the text before the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.
<!-- end -->

```javascript
given.string('sub.domain.com').beforeLast('.') // String { 'sub.domain' }
```

#### append

<!-- string.append -->
Alias for `concat`. Appends the given value to string.
<!-- end -->

```javascript
given.string('hello').append(' world') // String { 'hello world' }
```

#### prepend

<!-- string.prepend -->
Prepends the given value to string.
<!-- end -->

```javascript
given.string('world').prepend('hello ') // String { 'hello world' }
```

#### endWith

<!-- string.endWith -->
Appends the given value only if string doesn't already end with it.
<!-- end -->

```javascript
given.string('hello').endWith(' world') // String { 'hello world' }
given.string('hello world').endWith(' world') // String { 'hello world' }
```

#### startWith

<!-- string.startWith -->
Prepends the given value only if string doesn't already start with it.
<!-- end -->

```javascript
given.string('world').startWith('hello ') // String { 'hello world' }
given.string('hello world').startWith('hello ') // String { 'hello world' }
```

#### limit

<!-- string.limit -->
Truncates text to given length and appends second argument if string got truncated.
<!-- end -->

```javascript
given.string('The quick brown fox jumps over the lazy dog').limit(9) // The quick...
given.string('The quick brown fox jumps over the lazy dog').limit(9, ' (Read more)') // The quick (Read more)
given.string('Hello').limit(10) // Hello
```

#### tap

<!-- string.tap -->
Tap into the chain without modifying the string.
<!-- end -->

```javascript
given.string('')
  .append('!')
  .tap(str => console.log(str))
  .append('!')
  // ...
```

#### when

<!-- string.when -->
Executes the callback if first given value evaluates to true. Result will get transformed back into a flooent string if it is a raw string.
<!-- end -->

```javascript
// can be a boolean
given.string('').when(true, str => str.append('!')) // String { '!' }
given.string('').when(false, str => str.append('!')) // String { '' }

// or a method
given.string('hello').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello world' }
given.string('hi').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello' }
```

#### whenEmpty

<!-- string.whenEmpty -->
Executes the callback if string is empty. Result will get transformed back into a flooent string if it is a raw string.
<!-- end -->

```javascript
given.string('').whenEmpty(str => str.append('!')) // String { '!' }
given.string('hello').whenEmpty(str => str.append('!')) // String { 'hello' }
```

#### wrap

<!-- string.wrap -->
Wraps a string with the given value.
<!-- end --> 

```javascript
given.string('others').wrap('***') // String { '***others***' }
given.string('oldschool').wrap('<blink>', '</blink>') // String { '<blink>oldschool</blink>' }
```

#### unwrap

<!-- string.unwrap -->
Unwraps a string with the given value.
<!-- end --> 


```javascript
given.string('***others***').unwrap('***') // String { 'others' }
given.string('<blink>oldschool</blink>').unwrap('<blink>', '</blink>') // String { 'oldschool' }
```

#### camel

<!-- string.camel -->
Turns the string into camel case.
<!-- end -->

```javascript
given('foo bar').camel() // String { 'fooBar' }
```

#### title

<!-- string.title -->
Turns the string into title case.
<!-- end -->

```javascript
given.string('foo bar').title() // String { 'Foo Bar' }
```

#### studly

<!-- string.studly -->
Turns the string into studly case.
<!-- end -->

```javascript
given('foo bar').studly() // String { 'FooBar' }
```

#### capitalize

<!-- string.capitalize -->
Capitalizes the first character.
<!-- end -->

```javascript
given.string('foo bar').capitalize() // String { 'Foo bar' }
```

#### kebab

<!-- string.kebab -->
Turns the string into kebab case.
<!-- end -->

```javascript
given('foo bar').kebab() // String { 'foo-bar' }
```

#### snake

<!-- string.snake -->
Turns the string into snake case.
<!-- end -->

```javascript
given('foo bar').snake() // String { 'foo_bar' }
```

#### slug

<!-- string.slug -->
Turns the string into URI conform slug.
<!-- end -->

```javascript
given.string('Foo Bar ♥').slug() // String { 'foo-bar' }
given.string('foo bär').slug('+') // String { 'foo+bar' }
```

#### parse

<!-- string.parse -->
Parses a string back into its original form.
<!-- end -->

```javascript
given.string('true').parse() // true
given.string('23').parse() // 23
given.string('{\"a\":1}').parse() // { a: 1 }
```

## Arrays

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Array object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

#### pipe

<!-- array.pipe -->
Executes callback and transforms result back into a flooent array if the result is an array.
<!-- end -->

```javascript
const someMethodToBePipedThrough = array => array.append(1)

given.array([]).pipe(someMethodToBePipedThrough) // [1]
```

#### mutate

<!-- array.mutate -->
Mutates the original array with the return value of the given callback. This is an escape hatch for when you need it and usually not recommended.
<!-- end -->

```javascript
const numbers = given.array(1, 2, 3)

numbers.mutate(n => n.append(4)) // [1, 2, 3, 4]
numbers  // [1, 2, 3, 4]
```

#### sum

<!-- array.sum -->
Returns the sum of the array.
<!-- end -->

```javascript
given.array([2, 2, 1]).sum() // 5
```

> See usage for [arrays of objects](#sum-1).

#### when

Executes callback if first given value evaluates to true. Result will get transformed back into a flooent array if it is an array.

```javascript
// can be a boolean
given.array([]).when(true, str => str.append(1)) // [1]
given.array([]).when(false, str => str.append(1)) // []

// or a method
given.array([]).when(array => array.length === 0), array => array.append('called!')) // ['called']
given.array([]).when(array => array.length === 1, array => array.append('called!')) // []
```

#### isEmpty

Returns a boolean whether the array is empty or not.

```javascript
given.array([]).isEmpty() // true
given.array([1]).isEmpty() // false
```

#### toMap

<!-- array.toMap -->
Turns an array in the structure of `[ ['key', 'value'] ]` into a flooent map.
<!-- end -->

```javascript
given.map({ key: 'value' }).entries().toMap()
```

### Fluent methods

#### where

<!-- array.where -->
Filters array by given key / value pair.
<!-- end -->

```javascript
const numbers = [1, 1, 2, 3]

given.array(numbers).where(1) // [1, 1]
```

> See usage for [arrays of objects](#where-1).

#### whereIn

<!-- array.whereIn -->
Filters array by given values.
<!-- end -->

```javascript
const numbers = [1, 1, 2, 3]

given.array(numbers).whereIn([1, 3]) // [1, 1, 3]
```

> See usage for [arrays of objects](#wherein-1).

#### whereNot

Removes given value from array.

```javascript
const numbers = [1, 1, 2, 3]

given.array(numbers).whereNot(1) // [2, 3]
```

> See usage for [arrays of objects](#wherenot-1).

#### whereNotIn

<!-- array.whereNotIn -->
Removes given values from array.
<!-- end -->

```javascript
const numbers = [1, 1, 2, 3]

given.array(numbers).whereNotIn([2, 3]) // [1, 1]
```

> See usage for [arrays of objects](#wherenotin-1).

#### first

<!-- array.first -->
Returns the first (x) element(s) in the array or undefined.
<!-- end -->

```javascript
given.array([1, 2, 3]).first() // 1
given.array([1, 2, 3]).first(2) // [1, 2]
```

#### second

<!-- array.second -->
Returns the second element in the array or undefined.
<!-- end -->

```javascript
given.array([1, 2, 3]).second() // 2
```

#### last

<!-- array.last -->
Returns last (x) element(s) in array or undefined.
<!-- end -->

```javascript
given.array([1, 2, 3]).last() // 3
given.array([1, 2, 3]).last(2) // [2, 3]
```

<!-- array.last2 -->
Alternatively, pass in a callback to get the last item that passes the given truth test (inverse of `find`).
<!-- end -->

```javascript
given.array([1, 2, 3]).last(item => item > 1) // 3
```

#### nth

<!-- array.nth -->
Returns element at given index or undefined. If given value is negative, it searches from behind.
<!-- end -->

```javascript
given.array(['a', 'b', 'c']).nth(1) // 'b'
given.array(['a', 'b', 'c']).nth(5) // undefined
given.array(['a', 'b', 'c']).nth(-1) // 'c'
```

### reject

<!-- array.reject -->
Return all items that don't pass the given truth test. Inverse of `Array.filter`.
<!-- end -->

```javascript
given.array([{ id: 1, disabled: true }]).reject(item => item.disabled) // []
```

### until

<!-- array.until -->
Returns the items until either the given value is found, or the given callback returns `true`.
<!-- end -->

```javascript
given.array(['a', 'b', 'c']).until('c') // ['a', 'b']
given.array(['a', 'b', 'c']).until(item => item === 'c') // ['a', 'b']
```

#### shuffle

<!-- array.shuffle -->
Shuffles the array.
<!-- end -->

```javascript
given.array([1, 2, 3]).shuffle() // ?, maybe: [1, 3, 2]
```

#### unique

<!-- array.unique -->
Returns array of unique values.
<!-- end -->

```javascript
given.array([1, 1, 2]).unique() // [1, 2]
```

> See usage for [arrays of objects](#unique-1).

### chunk

<!-- array.chunk -->
Breaks the array into multiple, smaller arrays of a given size.
<!-- end -->

```javascript
given.array([1, 2, 3, 4, 5]).chunk(3) // [[1, 2, 3], [4, 5]]
```

### forPage

<!-- array.forPage -->
Returns the items for the given page and size.
<!-- end -->

```javascript
given.array(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(1, 3) // ['a', 'b', 'c']
given.array(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(2, 3) // ['d', 'e', 'f']
given.array(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(3, 3) // ['g']
given.array(['a', 'b', 'c', 'd', 'e', 'f', 'g']).forPage(4, 3) // []
```

### pad

<!-- array.pad -->
Fills up the array with the given value.
<!-- end -->

```javascript
given.array([1, 2, 3]).pad(5, 0) // [1, 2, 3, 0, 0]
```

#### filled

<!-- array.filled -->
Only returns items which are not empty.
<!-- end -->

```javascript
given.array([0, '', null, undefined, 1, 2]).filled() // [1, 2]
```

> See usage for [arrays of objects](#filled-1).

#### partition

<!-- array.partition -->
Returns a tuple separating the items that pass the given truth test.
<!-- end -->

```javascript
const users = given.array([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: true }])

const [activeUsers, inactiveUsers] = users.partition(user => user.active)
```

#### prepend

<!-- array.prepend -->
Prepends the given items to the array. Unlike `unshift`, it is immutable and returns a new array.
<!-- end -->

```javascript
const numbers = given.array([2, 3])
numbers.prepend(0, 1) // [0, 1, 2, 3]
```

To prepend items at a specific index, check out the [Pointer API](#pointer-api).

#### append

<!-- array.append -->
Appends the given items to the array. Unlike `push`, it is immutable and returns a new array.
<!-- end -->

```javascript
const numbers = given.array([0, 1])
numbers.append(2, 3) // [0, 1, 2, 3]
```

To append items at a specific index, check out the [Pointer API](#pointer-api).

#### sortAsc / sortDesc

Sorts an array in their respective order and **returns a new array**.

```javascript
given.array([3, 1, 2]).sortAsc() // [1, 2, 3]
given.array([3, 1, 2]).sortDesc() // [3, 2, 1]
```

> See usage for [arrays of objects](#sortasc--sortdesc-1).

#### tap

<!-- array.tap -->
Tap into the chain without modifying the array.
<!-- end -->

```javascript
given.array([])
  .append(1)
  .tap(array => console.log(array))
  .append(2)
  // ...
```

### Pointer API

<!-- array.point -->
Points to a specific index inside the array to do further actions on it.
<!-- end -->

```javascript
given.array(['music', 'video', 'tech']).point(1) // returns pointer pointing to 'video'
given.array(['music', 'video', 'tech']).point(-1) // returns pointer pointing to 'tech'
given.array(['music', 'video', 'tech']).point(item => item === 'music') // returns pointer pointing to 'music'
```

#### append

<!-- array.point.append -->
Appends given value to array in between the currently pointed item and its next item and returns a new array.
<!-- end -->

```javascript
given.array(['music', 'tech']).point(0).append('video') // ['music', 'video', 'tech']
```

#### prepend

<!-- array.point.prepend -->
Prepends given value to array in between the currently pointed item and its previous item and returns a new array.
<!-- end -->

```javascript
given.array(['music', 'tech']).point(1).prepend('video') // ['music', 'video', 'tech']
```

#### set

<!-- array.point.set -->
Sets the value at the current index and returns a new array.
<!-- end -->

```javascript
given.array(['music', 'tec']).point(1).set(item => item + 'h') // ['music', 'tech']
```

#### remove

<!-- array.point.remove -->
Removes the current index and returns a new array.
<!-- end -->

```javascript
given.array(['music', 'tech']).point(1).remove() // ['music']
```

#### split

Splits the array at the current index

```javascript
given.array(['a', 'is', 'c']).point(1).split() // [['a'], ['c']]
```

#### value

<!-- array.point.value -->
Returns the value for current pointer position.
<!-- end -->

```javascript
given.array(['music', 'tech']).point(1).value() // ['music', 'tech']
```

#### step

<!-- array.point.step -->
Steps forward or backwards given the number of steps.
<!-- end -->

```javascript
given.array(['music', 'tec']).point(1).step(-1).value() // ['music']
```

#### move

<!-- array.point.move -->
Moves an item in the array using the given source index to either "before" or "after" the given target.
<!-- end -->

```javascript
given.array(['b', 'a', 'c']).move(0, 'after', 1) // ['a', 'b', 'c']
given.array(['b', 'a', 'c']).move(0, 'before', 2) // ['a', 'b', 'c']
given.array(['b', 'a', 'c']).move(1, 'before', 0) // ['a', 'b', 'c']
```

Instead of the index, you can also specify "first" or "last":

```javascript
given.array(['c', 'a', 'b']).move('first', 'after', 'last') // ['a', 'b', 'c']
given.array(['b', 'c', 'a']).move('last', 'before', 'first') // ['a', 'b', 'c']
```

### Methods for arrays of objects

#### sum

<!-- array.sum2 -->
Returns the sum of the given field/result of callback in the array.
<!-- end -->

```javascript
  const users = [{ id: 1, points: 10 }, { id: 2, points: 10 }, { id: 3, points: 10 }]

  given.array(users).sum('points') // 30
  given.array(users).sum(user => user.points * 10) // 300
```

#### sortAsc / sortDesc

Sorts an array in their respective order and **returns a new array**.

```javascript
const numbers = [{ val: 3 }, { val: 1 }, { val: 2 }]
given.array(numbers).sortAsc('val') // [{ val: 1 }, { val: 2 }, { val: 3 }]
given.array(numbers).sortDesc('val') // [{ val: 3 }, { val: 2 }, { val: 1 }]
```

Also works by passing the index (useful when working with array entries).

```javascript
given.array([[0], [2], [1]]).sortAsc(0)) // [[0], [1], [2]])
```

Alternatively, pass in a map function of which its result will become the key instead.

```javascript
const numbers = [{ val: 3 }, { val: 1 }, { val: 2 }]
given.array(numbers).sortAsc(item => item.val) // [{ val: 1 }, { val: 2 }, { val: 3 }]
given.array(numbers).sortDesc(item => item.val) // [{ val: 3 }, { val: 2 }, { val: 1 }]
```

#### pluck

<!-- array.pluck -->
Pluck the given field out of each object in the array.
<!-- end -->

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
]

given.array(cities).pluck('name') // ['Munich', 'Naha']
```

#### where

<!-- array.where -->
Filters array by given key / value pair.
<!-- end -->

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Naha' },
]

given.array(cities).where('name', 'Munich') // [{ id: 1, name: 'Munich' }]
```

#### whereNot

<!-- array.whereNot -->
Removes items from array by the given key / value pair.
<!-- end -->

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Naha' },
]

given.array(cities).whereNot('name', 'Naha') // [{ id: 1, name: 'Munich' }]
```

#### whereIn

Filters array by given key and values.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Yoron' },
]

given.array(cities).whereIn('name', ['Munich', 'Yoron']) // [{ id: 1, name: 'Munich' }, { id: 3, name: 'Yoron' }]
```

#### whereNotIn

Removes items from array by the given key and values.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
  { id: 3, name: 'Yoron' },
]

given.array(cities).whereNotIn('name', ['Naha', 'Yoron']) // [{ id: 1, name: 'Munich' }]
```

#### omit

Omits given keys from all objects in the array.

```javascript
const people = [
  { id: 1, age: 24, initials: 'mz' },
  { id: 2, age: 2, initials: 'lz' }
]

given.array(people).omit(['initials', 'age']) // [ { id: 1 }, { id: 2 } ])
```

#### unique

Returns array of unique values comparing the given key.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 1, name: 'music' }]
given.array(items).unique('id') // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

Alternatively, pass in a function of which its result will become the key instead.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: 'MUSIC' }]
given.array(items).unique(item => item.name.toLowerCase()) // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

#### filled

<!-- array.filled -->
Only returns items which are not empty.
<!-- end -->

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: '' }]
given.array(items).filled('name') // [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }]
```

#### groupBy

<!-- array.groupBy -->
Groups an array by the given key and returns a flooent map.
<!-- end -->

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: 'music' }]
given.array(items).groupBy('name') // result is:
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
given.array(items).groupBy(item => item.name.toUpperCase()) // result is:
/*
{
  MUSIC: [{ id: 1, name: 'music' }, { id: 3, name: 'music' }],
  MOVIE: [{ id: 2, name: 'movie' }]
}
*/
```

### keyBy

Keys the collection by the given key and returns a flooent map.
If multiple items have the same key, only the last one will appear in the new collection.

```javascript
const items = [{ id: 1, name: 'music' }, { id: 2, name: 'movie' }, { id: 3, name: 'music' }]
given.array(items).keyBy('name') // result is:
/*
{
  music: { id: 3, name: 'music' },
  movie: { id: 2, name: 'movie' }
}
*/
```

### toKeyedMap

Turns the given array into a flooent map with each element becoming a key in the map.

```javascript
const genres = ['music', 'tech', 'games']
const map = given.array(genres).toKeyedMap(null) // result is:
/*
{
  music: null,
  tech: null,
  games: null
}
*/
```

Alternatively, pass in a callback to specify the default value for each item individually:

```javascript
const genres = ['music', 'tech', 'games']
const map = given.array(genres).toKeyedMap(genre => genre.toUpperCase()) // result is:
/*
{
  music: 'MUSIC',
  tech: 'TECH',
  games: 'GAMES'
}
*/
```

## Maps

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

The native methods `keys()`, `entries()` and `values()` will return an instance of flooent Array instead of a native Array.

> For nested data structures, only the first layer gets transformed into a map

#### toObject/toJSON

<!-- map.toJSON -->
Turns the map into an object.
<!-- end -->

```javascript
const map = given.map({ key: 'value' }) // Map { key → "value" }
map.toObject() // { key: 'value' }
map.toJSON() // { key: 'value' }
```

#### pull

Returns the value for the given key and deletes the key value pair from the map (mutation).

```javascript
const map = given.map({ key: 'value' })
map.pull('key') // 'value'
map.has('key') // false
```

#### mapKeys

<!-- map.mapKeys -->
Iterates the entries through the given callback and assigns each result as the key.
<!-- end -->

```javascript
const map = given.map({ a: 1 }).mapKeys((value, key, index) => key + value)

map.get('a1') // 1
```

#### mapValues

<!-- map.mapValues -->
Iterates the entries through the given callback and assigns each result as the value.
<!-- end -->

```javascript
const map = given.map({ a: '1' }).mapValues((value, key, index) => key + value)

map.get('a') // a1
```

#### only

<!-- map.only -->
Returns a new map with only the given keys.
<!-- end -->

```javascript
  given.map({ one: 1, two: 2, three: 3 }).only(['one', 'two']) // Map { "one" → 1, "two" → 2 }
```

#### except

<!-- map.except -->
Inverse of `only`. Returns a new map with all keys except for the given keys.
<!-- end -->

```javascript
  given.map({ one: 1, two: 2, three: 3 }).except(['one', 'two']) // Map { "three" → 3 }
```

#### arrange

<!-- map.arrange -->
Rearranges the map to the given keys. Any unmentioned keys will be appended to the end.
<!-- end -->

```javascript
given.map({ strings: 2, numbers: 1, functions: 4 })
  .arrange('numbers', 'functions')
  .keys() // ['numbers', 'functions', 'strings']
```

### rename

<!-- map.rename -->
Renames the given key with the new key if found, keeping the original insertion order.
<!-- end -->

```javascript
given.map({ one: 1, to: 2, three: 3 })
  .rename('to', 'two')
  .keys() // ['one', 'two', 'three']
```

## Numbers

<small>

[Back to top](#index)

</small>

You have access to [everything from the native Number object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).

#### times

<!-- number.times -->
Executes the callback for number of base values' times and returns a flooent array with the result of each iteration.
<!-- end -->

```javascript
given.number(3).times(i => i) // [0, 1, 2]
```

#### pad

<!-- number.pad -->
Fills up the number with zeroes.
<!-- end -->

```javascript
given.number(40).pad(4) // '0040'
```

#### ordinal

<!-- number.ordinal -->
Returns the number with its ordinal suffix. Only supports English.
<!-- end -->

```javascript
given.number(1).ordinal() // '1st'
given.number(9).ordinal() // '9th'
```

### isBetween / isBetweenOr

<!-- number.isBetween -->
Checks if the number is between two given numbers. `isBetweenOr` is inclusive, while `isBetween` is exclusive.
<!-- end -->

```javascript
given.number(5).isBetween(1, 10) // true
given.number(5).isBetween(5, 10) // false
given.number(5).isBetweenOr(5, 10) // true
```

### Fluent methods

#### Working with percentages

```javascript
given.number(40).percent().of(750) // Number { 300 }

given.number(300).of(750).inPercent() // Number { 40 }
```

#### round

<!-- number.round -->
Rounds down until .4 and up from .5.
<!-- end -->

```javascript
given.number(10.4).round() // Number { 10 }
given.number(10.5).round() // Number { 11 }
```

#### ceil

<!-- number.ceil -->
Always rounds its value up to the next largest whole number or integer.
<!-- end -->

```javascript
given.number(10.2).ceil() // Number { 11 }
```

#### floor

<!-- number.floor -->
Always rounds its value down.
<!-- end -->

```javascript
given.number(10.9).floor() // Number { 10 }
```

## Any

<small>

[Back to top](#index)

</small>

A generic helper class for any kind of data types.

#### do

Executes and returns the result of a callback.

This is useful for grouping common logic together and avoiding temporary variables. 

Before

```javascript
const user = User.first() // variable "user" is only used here
const nameMatches = expect(user.name).toBe('test name')
```

After

```javascript
const nameMatches = given.any(User.first()).do(user => {
  return expect(user.name).toBe('test name')
})
```

## Macros (extending flooent)

<small>

[Back to top](#index)

</small>

Extending flooent methods is easy as pie thanks to `macro`.

```javascript
import { given } from 'flooent'

given.string.macro('scream', function() {
  return this.toUpperCase()
})

given.string('hello').scream() // String { 'HELLO' }
```

Define macros at a central place before your business logic. E.g. entry point or service provider

### TypeScript

For TypeScript support, you need to additionally declare the module.

```typescript
declare module 'flooent' {
  interface Stringable {
    scream(): Stringable;
  }
}
```

### More examples

These methods, while convenient, are not in the core since they are not all too common yet quadruply the bundle size among other reasons.

<details>
<summary>Array.is</summary>
Deep compares an array with the given callback.

```javascript
import { given } from 'flooent'
import isequal from 'lodash.isequal' // npm install lodash.isequal

given.array.macro('is', function(compareWith) {
  return isequal(this, compareWith)
})
```

Then, use it like this:

```javascript
const users = [{ id: 1 }]
given.array(users).is([{ id: 1 }]) // true
```
</details>

<details>
<summary>Array.clone</summary>
Deep clone an array and map.

```javascript
import { given } from 'flooent'
import clonedeep from 'lodash.clonedeep' // npm install lodash.clonedeep

given.array.macro('clone', function() {
  // lodash does array.constructor(length) which doesn't work on subclassed arrays
  const clone = clonedeep([...this])
  return this.constructor.from(clone)
})

given.map.macro('clone', function() {
  return this.entries().clone().toMap()
})
```

Then, use it like this:

```javascript
given.array([['key', 'value']]).clone()
given.map([['key', 'value']]).clone()
```
</details>

<details>
<summary>String.plural & String.singular</summary>
Turns string into plural/singular form.

```javascript
import { given } from 'flooent'
import pluralize from 'pluralize' // npm install pluralize

given.string.macro('plural', function(count) {
  const plural = pluralize(this, count, false)
  return new this.constructor(plural) // new up again because pluralize returns raw string.
})

given.string.macro('singular', function() {
  return new this.constructor(pluralize.singular(this))
})
```

Then, use it like this:

```javascript
given.string('child').plural() // String { 'children' }
given.string('child').plural(3) // String { 'children' }
given.string('child').plural(1) // String { 'child' }

given.string('children').singular() // String { 'child' }
given.string('child').singular() // String { 'child' }
```
</details>

## Future considerations

- Drop CJS once ES modules are widely supported in Node. ES modules are much lighter.
