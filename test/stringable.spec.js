const test = require('japa')
const { Stringable: Str, given } = require('../dist')

function isStr(assert, result) {
  assert.instanceOf(result, Str)
}

test('it can create Stringable from string', (assert) => {
  assert.equal(new Str('test'), 'test')
  isStr(assert, new Str('test'))
})

test('it can turn Stringable back into raw string', assert => {
  assert.equal(typeof given('test'), 'object')
  isStr(assert, given('test'))
  assert.equal(typeof given('test').valueOf(), 'string')
  assert.equal(typeof given('test').toString(), 'string')
})

test('it returns instance of Stringable for existing methods', assert => {
  isStr(assert, given('test replace').replace('', ''))
  isStr(assert, given('test trim').trim())
  isStr(assert, given('test trimEnd').trimEnd())
  isStr(assert, given('test trimStart').trimStart())
  isStr(assert, given('test substr').substr(0))
  isStr(assert, given('test substring').substring(0))
  isStr(assert, given('test slice').slice(0))
  isStr(assert, given('test concat').concat('a'))
  isStr(assert, given('test repeat').repeat(2))
  isStr(assert, given('test repeat').repeat(2))
  isStr(assert, given('test toLocaleLowerCase').toLocaleLowerCase())
  isStr(assert, given('test toLocaleUpperCase').toLocaleUpperCase())
  isStr(assert, given('test toLowerCase').toLowerCase())
  isStr(assert, given('test toUpperCase').toUpperCase())
  isStr(assert, given('test charAt').charAt(1))
  isStr(assert, given('test charCodeAt').charCodeAt(1))
})

test('after() returns all remaining text after the first haystack', assert => {
  isStr(assert, given('').after('.'))
  assert.equal(given('michael@somemail.com').after('@'), 'somemail.com')
  assert.equal(given('michael1.michael2.@somemail.com').after('michael'), '1.michael2.@somemail.com')
  assert.equal(given('michael@somemail.com').after('nonexisting'), 'michael@somemail.com')
})

test('afterLast() returns all remaining text after the last haystack', assert => {
  isStr(assert, given('').afterLast('.'))
  assert.equal(given('michael@some.mail.com').afterLast('.'), 'com')
  assert.equal(given('michael1.michael2.@somemail.com').afterLast('michael'), '2.@somemail.com')
  assert.equal(given('michael@somemail.com').afterLast('com'), '')
  assert.equal(given('michael@somemail.com').afterLast('nonexisting'), 'michael@somemail.com')
})

test('before() returns all text before the first haystack', assert => {
  isStr(assert, given('').before('.'))
  assert.equal(given('michael@somemail.com').before('@'), 'michael')
  assert.equal(given('hi hello hi hello').before('hello'), 'hi ')
  assert.equal(given('michael@somemail.com').before('nonexisting'), 'michael@somemail.com')
})

test('beforeLast() returns all text before the last haystack', assert => {
  isStr(assert, given('').beforeLast('.'))
  assert.equal(given('michael@some.mail.com').beforeLast('.'), 'michael@some.mail')
  assert.equal(given('hi hello hi hello').beforeLast('hello'), 'hi hello hi ')
  assert.equal(given('michael@somemail.com').beforeLast('nonexisting'), 'michael@somemail.com')
})

test('fetches text between two points', assert => {
  isStr(assert, given('nested.sub.domain.com').between('.').and('.'))
  assert.equal(given('nested.sub.domain.com').between('.').and('.'), 'sub')
  assert.equal(given('hello@michael@some.mail.com').between('@').and('.'), 'michael@some')
  assert.equal(given('hello@michael@some.mail.com').between('@').andLast('.'), 'michael@some.mail')
  assert.equal(given('hello@michael@some.mail.com').betweenLast('@').and('.'), 'some')
  assert.equal(given('hello@michael@some.mail.com').betweenLast('@').andLast('.'), 'some.mail')
})

test('when() can apply modifications conditionally', assert => {
  const callback = str => str.append('ing')
  isStr(assert, given('test').when(true, () => 'not Str'))
  assert.equal(given('test').when(true, callback), 'testing')
  assert.equal(given('test').when(false, callback), 'test')
  assert.equal(given('test').when(str => str.is('test'), callback), 'testing')
  assert.equal(given('test').when(str => str.is('not test'), callback), 'test')
})

test('wrap() wraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, given('').wrap(':'))
  assert.equal(given('others').wrap('***'), '***others***')
  assert.equal(given('oldschool').wrap('<blink>', '</blink>'), '<blink>oldschool</blink>')
})

test('unwrap() unwraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, given('').unwrap(':'))
  assert.equal(given('***others***').unwrap('***'), 'others')
  assert.equal(given('others***').unwrap('***'), 'others')
  assert.equal(given('***others').unwrap('***'), 'others')
  assert.equal(given('others').unwrap('***'), 'others')
  assert.equal(given('<blink>oldschool</blink>').unwrap('<blink>', '</blink>'), 'oldschool')
})

test('append() concats a string to the existing one', assert => {
  isStr(assert, given('').append(':'))
  assert.equal(given('first').append('-second'), 'first-second')
})

test('prepend(), well, prepends a string to the existing one', assert => {
  isStr(assert, given('').prepend(':'))
  assert.equal(given('second').prepend('first-'), 'first-second')
})

test('is() compares the raw string against what gets passed in', assert => {
  assert.isTrue(given('first').is('first'))
  assert.isFalse(given('first').is('second'))
  assert.isFalse(given('').is(0))
})

test('includedIn() checks if string is included in array', assert => {
  assert.isTrue(given('first').includedIn(['first']))
  assert.isFalse(given('first').includedIn(['second']))
})

test('endWith() ends a string with what gets passed in if it does not already end with that string', assert => {
  isStr(assert, given('').endWith(':'))
  assert.equal(given('User').endWith('Controller'), 'UserController')
  assert.equal(given('UserController').endWith('Controller'), 'UserController')
})

test('startWith() starts a string with what gets passed in if it does not already start with that string', assert => {
  isStr(assert, given('').startWith(':'))
  assert.equal(given('User').startWith('Note: '), 'Note: User')
  assert.equal(given('Note: User').startWith('Note: '), 'Note: User')
})

test('limit() truncates a string and appends the second argument the string surpasses the limit', assert => {
  isStr(assert, given('it is a beautiful night').limit(5))
  assert.equal(given('it is a beautiful night').limit(5), 'it is...')
  assert.equal(given('it is a beautiful night').limit(50), 'it is a beautiful night')
  assert.equal(given('it is a beautiful night').limit(5, '(...)'), 'it is(...)')
  assert.equal(given('it is a beautiful night').limit(50, '...'), 'it is a beautiful night')

  // make sure we don't have off by 1 bug
  assert.equal(given('123').limit(2, '...'), '12...')
  assert.equal(given('123').limit(3, '...'), '123')
  assert.equal(given('123').limit(4, '...'), '123')
})

test('whenEmpty() can apply modifications conditionally if the string is empty ("")', assert => {
  isStr(assert, given('').whenEmpty(() => 'not Str'))
  const callback = str => str.append('replaced!')
  assert.equal(given('').whenEmpty(callback), 'replaced!')
  assert.equal(given('nope').whenEmpty(callback), 'nope')
})

test('pipe() calls the callback and lets you continue the chain', assert => {
  isStr(assert, given('hello').pipe(str => 'not Str!'))
  assert.equal(given('hello').pipe(str => str.append('!')), 'hello!')
})

test('kebab(), title(), snake(), studly() and camel() turns string into respective case', assert => {
  isStr(assert, given('').kebab())
  isStr(assert, given('').title())
  isStr(assert, given('').snake())
  isStr(assert, given('').camel())
  isStr(assert, given('').studly())

  assert.equal(given('Foo Bar').kebab(), 'foo-bar')
  assert.equal(given('foo bar').title(), 'Foo Bar')
  assert.equal(given('foo BAR').title(), 'Foo BAR')
  assert.equal(given('Foo bar').snake(), 'foo_bar')
  assert.equal(given('foo bar').studly(), 'FooBar')
  assert.equal(given('--Foo-bar--').camel(), 'fooBar')
})

test('capitalize() capitalizes the first character', assert => {
  isStr(assert, given('').capitalize())
  assert.equal(given('foo Bar').capitalize(), 'Foo Bar')
  assert.equal(given('FOO').capitalize(), 'FOO')
})

test('tap() lets you tap into the process without modifying the string', assert => {
  isStr(assert, given('').tap(() => 1))

  let wasCalled = false
  given('hello').tap(() => wasCalled = true)
  assert.isTrue(wasCalled)
  assert.equal(given('').tap(str => str.append('nope')), '')
  assert.equal(given('').tap(str => str.append('nope')).append('yup'), 'yup')
})

test('parse() converts a stringified version back into original', assert => {
  assert.equal(given('1').parse(), '1')
  assert.isTrue(given('true').parse())

  const stringified = JSON.stringify({ a: 1 })
  assert.deepEqual(given(stringified).parse(), { a: 1 })
})

test('slugify() turns string into URL friendly format', assert => {
  isStr(assert, given('Stringable Getting Started ♥').slug())
  assert.equal(given('Stringable Getting Started ♥').slug(), 'stringable-getting-started')
  assert.equal(given('Ä getting started').slug('+'), 'a+getting+started')
})

test('plural() return pluraized version of string', assert => {
  isStr(assert, given('child').plural())
  assert.equal(given('child').plural(), 'children')
  assert.equal(given('snake').plural(2), 'snakes')
  assert.equal(given('child').plural(1), 'child')
})

test('singular() return singular version of string', assert => {
  isStr(assert, given('child').singular())
  assert.equal(given('children').singular(), 'child')
  assert.equal(given('snakes').singular(), 'snake')
  assert.equal(given('child').singular(), 'child')
})
