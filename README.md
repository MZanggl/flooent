# flooent

> `npm install flooent`

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
given(path)
  .betweenLast('/').andLast('.')
  .endWith('Controller')
  .capitalize()
```

## given

Use `given` to create either a flooent Number, Array or String depending on its type.

```javascript
import { given } from 'flooent'

given('hello') // instance of Stringable
given([1, 2]) // instance of Arrayable
given(1) // instance of Numberable
```

Flooent objects simply extend the native functionality, so you can still execute any native method like `given('hello').includes('h')`.

To turn flooent strings and numbers back into their respective primitive form, use `given('hello').valueOf()`.

`given` also accepts a callback as the second argument which will automatically apply `valueOf()` at the end.

```javascript
const rawHelloWorld = given('hello', message => {
  return message.append(' world')
})
```

## Constraints

The contraints that apply to flooent strings and numbers are the same that apply to when you new up a native string/number using new (`new String('')`) and is just how JavaScript works.

For one, the type will be `object` instead of `string`.

```javascript
typeof given('') // object
typeof '' // string
```

Flooent strings and numbers are immutable. You can still do things like this:

```javascript
given('?') + '!' // '?!'
given(1) + 1 // 2
```

which will return a primitive (not an instance of flooent).

However you can not mutate flooent objects like this:

```javascript
given('') += '!' // ERROR
given(1) += 1 // ERROR
```

There are various fluent alternatives available.

## Arrays

### Fluent methods

#### pull

Removes given fields from array.

```javascript
const numbers = [1, 2, 3, 1, 2, 3]

given(numbers).pull(1, 2) // [3, 3]
```

#### first

Returns first element in array or undefined.

```javascript
given([1, 2, 3]).first() // 1
```

#### second

Returns second element in array or undefined.

```javascript
given([1, 2, 3]).second() // 2
```

#### last

Returns last element in array or undefined.

```javascript
given([1, 2, 3]).last() // 3
```

#### nth

Returns element at given index or undefined. If given value is negative, it searches from behind.

```javascript
given(['a', 'b', 'c']).nth(1) // 'b'
given(['a', 'b', 'c']).nth(5) // undefined
given(['a', 'b', 'c']).nth(-1) // 'c'
```

### Fluent methods for array of objects

#### pluck

Pluck given field out an object of arrays.

```javascript
const cities = [
  { id: 1, name: 'Munich' },
  { id: 2, name: 'Naha' },
]

given(cities).pluck('name') // ['Munich', 'Naha']
```


## Strings

#### is

Compares given value with the raw string.

```javascript
given('flooent').is('flooent') // true
```

### Fluent methods

#### after

Returns the remaining text after the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').after('.') // String { 'domain.com' }
```

#### afterLast

Returns the remaining text after the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').afterLast('.') // String { 'com' }
```

#### before

Returns the text before the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').before('.') // String { 'sub' }
```

#### beforeLast

Returns the text before the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').beforeLast('.') // String { 'sub.domain' }
```

#### between

Returns the text between two given values.

```javascript
given('some@email.com').between('@').and('.') // String { 'email' }
given('some@sub.email.com').between('@').andLast('.') // String { 'sub.email' }
```

#### betweenLast

Returns the text between the last occurrence of given value and second function respectively.

```javascript
given('john.doe@email.com:123456').betweenLast('.').and(':') // String { 'com' }
given('App/Models/payment.method.js').betweenLast('/').andLast('.') // String { 'payment.method' }
```

#### append

Alias for `concat`. Appends given value to string.

```javascript
given('hello').append(' world') // String { 'hello world' }
```

#### prepend

Prepends given value to string.

```javascript
given('world').prepend('hello ') // String { 'hello world' }
```

#### endWith

Appends given value only if string doesn't already end with it.

```javascript
given('hello').endWith(' world') // String { 'hello world' }
given('hello world').endWith(' world') // String { 'hello world' }
```

#### startWith

Prepends given value only if string doesn't already start with it.

```javascript
given('world').startWith('hello ') // String { 'hello world' }
given('hello world').startWith('hello ') // String { 'hello world' }
```

#### limit

Truncates text to given length and appends second argument if string got truncated.

```javascript
given('The quick brown fox jumps over the lazy dog').limit(9) // The quick...
given('The quick brown fox jumps over the lazy dog').limit(9, ' (Read more)') // The quick (Read more)
given('Hello').limit(10) // Hello
```

#### pipe

Executes callback and transforms result back into a flooent string.

```javascript
given('').pipe(str => str.append('!')) // String { '!' }
```

#### when

Executes callback if first given value evaluates to true. Result will get transformed back into a flooent string.

```javascript
// can be a boolean
given('').when(true, str => str.append('!')) // String { '!' }
given('').when(false, str => str.append('!')) // String { '' }

// or a method
given('hello').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello world' }
given('hi').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello' }
```

#### whenEmpty

Executes callback if string is empty. Result will get transformed back into a flooent string.

```javascript
given('').whenEmpty(str => str.append('!')) // String { '!' }
given('hello').whenEmpty(str => str.append('!')) // String { 'hello' }
```

#### wrap

Wraps a string with given value.

```javascript
given('others').wrap('***') // String { '***others***' }
given('oldschool').wrap('<blink>', '</blink>') // String { '<blink>oldschool</blink>' }
```

#### unwrap

Unwraps a string with given value.


```javascript
given('***others***').unwrap('***') // String { 'others' }
given('<blink>oldschool</blink>').unwrap('<blink>', '</blink>') // String { 'oldschool' }
```

#### camel

Turns string into camel case.

```javascript
given('foo bar').camel() // String { 'fooBar' }
```

#### title

Turns string into title case.

```javascript
given('foo bar').title() // String { 'Foo Bar' }
```

#### studly

Turns string into studly case.

```javascript
given('foo bar').studly() // String { 'FooBar' }
```

#### kebab

Turns string into kebab case.

```javascript
given('foo bar').kebab() // String { 'foo-bar' }
```

#### snake

Turns string into snake case.

```javascript
given('foo bar').snake() // String { 'foo_bar' }
```

#### capitalize

Capitalizes first character.

```javascript
given('foo bar').capitalize() // String { 'Foo bar' }
```

#### slug

Turns string into URL friendly slug.

```javascript
given('Foo Bar').slug() // String { 'foo-bar' }
given('foo bar').slug('+') // String { 'foo+bar' }
```

#### parse

Parses a string back into its original form.

```javascript
given('true').parse() // true
given('23').parse() // 23
given('{\"a\":1}').parse() // { a: 1 }
```

#### plural

Turns a string into its plural form.

```javascript
given('child').plural() // String { 'children' }
given('child').plural(3) // String { 'children' }
given('child').plural(1) // String { 'child' }
```

#### singular

Turns a string into its singular form.

```javascript
given('children').singular() // String { 'child' }
given('child').singular() // String { 'child' }
```

## Numbers

#### forEach

```javascript
given(5).forEach(i => {
  console.log(i)
})
```

#### map

```javascript
given(3).map(i => i) // [0, 1, 2]
```

### Fluent methods

#### Working with percentages

```javascript
given(40).percent().of(750) // Number { 300 }

given(300).of(750).inPercent() // Number { 40 }
```

#### round

Rounds down until .4 and up from .5.

```javascript
given(10.4).round() // Number { 10 }
given(10.5).round() // Number { 11 }
```

#### ceil

Always rounds its value up to the next largest whole number or integer.

```javascript
given(10.2).ceil() // Number { 11 }
```

#### floor

Always rounds its value down.

```javascript
given(10.9).floor() // Number { 10 }
```

#### max

Returns the largest value.

```javascript
given(10).max(20) // Number { 20 }
given(10).max(1, 2) // Number { 10 }
```

#### min

Returns the lowest-valued number passed into it.

```javascript
given(10).min(20) // Number { 10 }
given(10).min(5, 20) // Number { 5 }
```