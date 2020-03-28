# flooent

Fluent interface to provide an expressive syntax for common manipulations.

Turns logical, procedural, "hard to visualize" code

```javascript
// given we have const path = 'App/Controllers/user.js'
const filename = path.substring(path.lastIndexOf('/') + 1)
let name = filename.substring(0, filename.lastIndexOf('.'))
if (!name.endsWith('Controller')) name+= 'Controller'
return name.substring(0, 1).toUpperCase() + name.substring(1)
```

into plain English

```javascript
// given we have const path = 'App/Controllers/user.js'
given(path)
  .betweenLast('/').andLast('.')
  .endWith('Controller')
  .capitalize()
```

## given

Use `given` to create either a flooent Array or String depending on its type.

```javascript
import { given } from 'flooent'

given('hello') // instance of Stringable
given([1, 2]) // instance of Arrayable
```

Flooent objects simply extend the native functionality, so you can still execute any native method like `given('hello').includes('h')`

## Arrays

TODO

## Strings

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

### before

Returns the text before the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').before('.') // String { 'sub' }
```

### beforeLast

Returns the text before the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
given('sub.domain.com').beforeLast('.') // String { 'sub.domain' }
```

### between

Returns the text between two given values.

```javascript
given('some@email.com').between('@').and('.') // String { 'email' }
given('some@sub.email.com').between('@').andLast('.') // String { 'sub.email' }
```

### betweenLast

Returns the text between the last occurrence of given value and second function respectively.

```javascript
given('john.doe@email.com:123456').betweenLast('.').and(':') // String { 'com' }
given('App/Models/payment.method.js').betweenLast('/').andLast('.') // String { 'payment.method' }
```

### append

Alias for `concat`. Appends given value to string.

```javascript
given('hello').append(' world') // String { 'hello world' }
```

### prepend

Prepends given value to string.

```javascript
given('world').prepend('hello ') // String { 'hello world' }
```

### startWith

Appends given value only if string doesn't already end with it.

```javascript
given('hello').endWith(' world') // String { 'hello world' }
given('hello world').endWith(' world') // String { 'hello world' }
```

### startWith

Prepends given value only if string doesn't already start with it.

```javascript
given('world').startWith('hello ') // String { 'hello world' }
given('hello world').startWith('hello ') // String { 'hello world' }
```

### is

Compares given value with the raw string.

```javascript
given('flooent').is('flooent') // true
```

### limit

Truncates text to given length and appends second argument if string got truncated.

```javascript
given('The quick brown fox jumps over the lazy dog').limit(9) // The quick...
given('The quick brown fox jumps over the lazy dog').limit(9, ' (Read more)') // The quick (Read more)
given('Hello').limit(10) // Hello
```

### pipe

Executes callback and transforms result back into a flooent string.

```javascript
given('').pipe(str => str.append('!')) // String { '!' }
```

### when

Executes callback if first given value evaluates to true. Result will get transformed back into a flooent string.

```javascript
// can be a boolean
given('').when(true, str => str.append('!')) // String { '!' }
given('').when(false, str => str.append('!')) // String { '' }

// or a method
given('hello').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello world' }
given('hi').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello' }
```

### whenEmpty

Executes callback if string is empty. Result will get transformed back into a flooent string.

```javascript
given('').whenEmpty(str => str.append('!')) // String { '!' }
given('hello').whenEmpty(str => str.append('!')) // String { 'hello' }
```

### wrap

Wraps a string with given value.

```javascript
given('others').wrap('***') // String { '***others***' }
given('oldschool').wrap('<blink>', '</blink>') // String { '<blink>oldschool</blink>' }
```

### unwrap

Unwraps a string with given value.


```javascript
given('***others***').unwrap('***') // String { 'others' }
given('<blink>oldschool</blink>').unwrap('<blink>', '</blink>') // String { 'oldschool' }
```

### camel

Turns string into camel case.

```javascript
given('foo bar').camel() // String { 'fooBar' }
```

### title

Turns string into title case.

```javascript
given('foo bar').title() // String { 'Foo Bar' }
```

### studly

Turns string into studly case.

```javascript
given('foo bar').studly() // String { 'FooBar' }
```

### kebab

Turns string into kebab case.

```javascript
given('foo bar').kebab() // String { 'foo-bar' }
```

### snake

Turns string into snake case.

```javascript
given('foo bar').snake() // String { 'foo_bar' }
```

### capitalize

Capitalizes first character.

```javascript
given('foo bar').capitalize() // String { 'Foo bar' }
```

### slug

Turns string into URL friendly slug.

```javascript
given('Foo Bar').slug() // String { 'foo-bar' }
given('foo bar').slug('+') // String { 'foo+bar' }
```

### parse

Parses a string back into its original form.

```javascript
given('true').parse() // true
given('23').parse() // 23
given('{\"a\":1}').parse() // { a: 1 }
```

### plural

Turns a string into its plural form.

```javascript
given('child').plural() // String { 'children' }
given('child').plural(3) // String { 'children' }
given('child').plural(1) // String { 'child' }
```

### singular

Turns a string into its singular form.

```javascript
given('children').singular() // String { 'child' }
given('child').singular() // String { 'child' }
```

### Constraints!

The contraints that apply to flooent strings are the same that apply to when you new up a native string using `new String('')` and is just how JavaScript works.

For one, the type will be `object` instead of `string`.

```javascript
typeof given('') // object
typeof '' // string
```

Also:

> flooent strings are immutable!

While you can still concatinate a string like this:

```javascript
given('') + '!'
```

which will return a raw string (not an instance of flooent), you can not mutate flooent strings like this:

```javascript
given('') += '!' // ERROR
```

To change the value of a string there are a couple of options.

```javascript
let string = given('')

// overwrite variable completely
string = string + '!' // returns raw string

// use an available expressive fluent method
string.append('!')

// pipe it through!
string.pipe(str => 'replace existing value with this text only!')
```

You can turn a flooent string into a raw string using:

```javascript
given('').valueOf()
// or
given('').toString()
```