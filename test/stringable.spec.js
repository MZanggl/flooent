const test = require('japa')
const { Str } = require('../dist')

test('it can create Stringable from string', (assert) => {
  assert.equal(new Str('test'), 'test')
  assert.equal(Str.from('test'), 'test')
  assert.equal(Str.of('test'), 'test')
  assert.equal(typeof Str.of('test'), 'object')
  assert.instanceOf(Str.of('test'), Str)
})

test('it can create Stringable from types other than string', (assert) => {
  // nesting String/Str
  assert.equal(Str.of(Str.of('test')), 'test')
  assert.equal(Str.of(new String('test')), 'test')

  // arrays, numbers and booleans, json
  assert.equal(Str.from(1), '1')
  assert.equal(Str.from([1, 2]), '1,2')
  assert.equal(Str.of(true), 'true')
  assert.equal(Str.of({ a: 1 }), '{\"a\":1}')

  // null, undefined etc.
  assert.equal(Str.of(null), '')
  assert.equal(Str.of(undefined), '')

  try {
    Str.of(() => 1)
  } catch(error) {
    assert.equal(error.message, 'function is not an allowed type')
  }
})

test('it can turn Stringable back into raw string', assert => {
  assert.equal(typeof Str.of('test'), 'object')
  assert.instanceOf(Str.of('test'), Str)
  assert.equal(typeof Str.of('test').valueOf(), 'string')
  assert.equal(typeof Str.of('test').toString(), 'string')
})

test('it returns instance of Stringable for existing methods', assert => {
  assert.instanceOf(Str.of('test replace').replace('', ''), Str)
  assert.instanceOf(Str.of('test trim').trim(), Str)
  assert.instanceOf(Str.of('test trimEnd').trimEnd(), Str)
  assert.instanceOf(Str.of('test trimStart').trimStart(), Str)
  assert.instanceOf(Str.of('test substr').substr(0), Str)
  assert.instanceOf(Str.of('test substring').substring(0), Str)
  assert.instanceOf(Str.of('test slice').slice(0), Str)
  assert.instanceOf(Str.of('test concat').concat('a'), Str)
  assert.instanceOf(Str.of('test repeat').repeat(2), Str)
  assert.instanceOf(Str.of('test repeat').repeat(2), Str)
  assert.instanceOf(Str.of('test toLocaleLowerCase').toLocaleLowerCase(), Str)
  assert.instanceOf(Str.of('test toLocaleUpperCase').toLocaleUpperCase(), Str)
  assert.instanceOf(Str.of('test toLowerCase').toLowerCase(), Str)
  assert.instanceOf(Str.of('test toUpperCase').toUpperCase(), Str)
  assert.instanceOf(Str.of('test charAt').charAt(1), Str)
  assert.instanceOf(Str.of('test charCodeAt').charCodeAt(1), Str)
})

test('after() returns all remaining text after the first haystack', assert => {
  assert.equal(Str.of('michael@somemail.com').after('@'), 'somemail.com')
  assert.equal(Str.of('michael1.michael2.@somemail.com').after('michael'), '1.michael2.@somemail.com')
  assert.equal(Str.of('michael@somemail.com').after('nonexisting'), 'michael@somemail.com')
})

test('afterLast() returns all remaining text after the last haystack', assert => {
  assert.equal(Str.of('michael@some.mail.com').afterLast('.'), 'com')
  assert.equal(Str.of('michael1.michael2.@somemail.com').afterLast('michael'), '2.@somemail.com')
  assert.equal(Str.of('michael@somemail.com').afterLast('com'), '')
  assert.equal(Str.of('michael@somemail.com').afterLast('nonexisting'), 'michael@somemail.com')
})

test('before() returns all text before the first haystack', assert => {
  assert.equal(Str.of('michael@somemail.com').before('@'), 'michael')
  assert.equal(Str.of('hi hello hi hello').before('hello'), 'hi ')
  assert.equal(Str.of('michael@somemail.com').before('nonexisting'), 'michael@somemail.com')
})

test('beforeLast() returns all text before the last haystack', assert => {
  assert.equal(Str.of('michael@some.mail.com').beforeLast('.'), 'michael@some.mail')
  assert.equal(Str.of('hi hello hi hello').beforeLast('hello'), 'hi hello hi ')
  assert.equal(Str.of('michael@somemail.com').beforeLast('nonexisting'), 'michael@somemail.com')
})

test('fetches text between two points', assert => {
  assert.equal(Str.of('hello@michael@some.mail.com').between('@').and('.'), 'michael@some')
  assert.equal(Str.of('hello@michael@some.mail.com').between('@').andLast('.'), 'michael@some.mail')
  assert.equal(Str.of('hello@michael@some.mail.com').betweenLast('@').and('.'), 'some')
  assert.equal(Str.of('hello@michael@some.mail.com').betweenLast('@').andLast('.'), 'some.mail')
})

test('when() can apply modifications conditionally', assert => {
  const callback = str => str.append('ing')
  assert.equal(Str.of('test').when(true, callback), 'testing')
  assert.equal(Str.of('test').when(false, callback), 'test')
  assert.equal(Str.of('test').when(str => str.is('test'), callback), 'testing')
  assert.equal(Str.of('test').when(str => str.is('not test'), callback), 'test')
  assert.equal(Str.of('test').when(true, () => 'not Str').prepend('not '), 'not not Str')
})

test('wrap() wraps a string by the first (or possibly second) argument', assert => {
  assert.equal(Str.of('others').wrap('***'), '***others***')
  assert.equal(Str.of('oldschool').wrap('<blink>', '</blink>'), '<blink>oldschool</blink>')
})

test('unwrap() unwraps a string by the first (or possibly second) argument', assert => {
  assert.equal(Str.of('***others***').unwrap('***'), 'others')
  assert.equal(Str.of('others***').unwrap('***'), 'others')
  assert.equal(Str.of('***others').unwrap('***'), 'others')
  assert.equal(Str.of('others').unwrap('***'), 'others')
  assert.equal(Str.of('<blink>oldschool</blink>').unwrap('<blink>', '</blink>'), 'oldschool')
})

test('append() concats a string to the existing one', assert => {
  assert.equal(Str.of('first').append('-second'), 'first-second')
})

test('prepends(), well, prepends a string to the existing one', assert => {
  assert.equal(Str.of('second').prepend('first-'), 'first-second')
})

test('is() compares the raw string against what gets passed in', assert => {
  assert.isTrue(Str.of('first').is('first'))
  assert.isFalse(Str.of('first').is('second'))
  assert.isFalse(Str.of('').is(0))
})

test('endWith() ends a string with what gets passed in if it does not already end with that string', assert => {
  assert.equal(Str.of('User').endWith('Controller'), 'UserController')
  assert.equal(Str.of('UserController').endWith('Controller'), 'UserController')
})

test('startWith() starts a string with what gets passed in if it does not already start with that string', assert => {
  assert.equal(Str.of('User').startWith('Note: '), 'Note: User')
  assert.equal(Str.of('Note: User').startWith('Note: '), 'Note: User')
})

test('limit() truncates a string and appends the second argument the string surpasses the limit', assert => {
  assert.equal(Str.of('it is a beautiful night').limit(5), 'it is')
  assert.equal(Str.of('it is a beautiful night').limit(50), 'it is a beautiful night')
  assert.equal(Str.of('it is a beautiful night').limit(5, '...'), 'it is...')
  assert.equal(Str.of('it is a beautiful night').limit(50, '...'), 'it is a beautiful night')

  // make sure we don't have off by 1 bug
  assert.equal(Str.of('123').limit(2, '...'), '12...')
  assert.equal(Str.of('123').limit(3, '...'), '123')
  assert.equal(Str.of('123').limit(4, '...'), '123')
})

test('whenEmpty() can apply modifications conditionally if the string is empty ("")', assert => {
  const callback = str => str.append('replaced!')
  assert.equal(Str.of('').whenEmpty(callback), 'replaced!')
  assert.equal(Str.of('nope').whenEmpty(callback), 'nope')
  assert.equal(Str.of('').whenEmpty(() => 'filled').append('!'), 'filled!')
})

test('pipe() calls the callback and lets you continue the chain', assert => {
  assert.equal(Str.of('hello').pipe(str => str.append('!')).append('!'), 'hello!!')
  assert.equal(Str.of('hello').pipe(str => 'not Str!').prepend('not '), 'not not Str!')
})

test('kebab(), title(), snake() and camel() turns string into respective case', assert => {
  assert.equal(Str.of('Foo Bar').kebab(), 'foo-bar')
  assert.equal(Str.of('foo bar').title(), 'Foo Bar')
  assert.equal(Str.of('Foo bar').snake(), 'foo_bar')
  assert.equal(Str.of('--Foo-bar--').camel(), 'fooBar')
})

test('capitalize() capitalizes the first character while lowercasing the rest', assert => {
  assert.equal(Str.of('foo bar').capitalize(), 'Foo bar')
  assert.equal(Str.of('FOO').capitalize(), 'Foo')
})

test('tap() lets you tap into the process without modifying the string', assert => {
  let wasCalled = false
  Str.of('hello').tap(() => wasCalled = true)
  assert.isTrue(wasCalled)
  assert.equal(Str.of('').tap(str => str.append('nope')), '')
  assert.equal(Str.of('').tap(str => str.append('nope')).append('yup'), 'yup')
})

test('parse() converts a stringified version back into original', assert => {
  assert.equal(Str.of('1').parse(), '1')
  assert.isTrue(Str.of('true').parse())

  const stringified = JSON.stringify({ a: 1 })
  assert.deepEqual(Str.of(stringified).parse(), { a: 1 })
})

test('slugify() turns string into URL friendly format', assert => {
  assert.equal(Str.of('Stringable Getting Started ♥').slug(), 'stringable-getting-started')
  assert.equal(Str.of('Ä getting started').slug('+'), 'a+getting+started')
})