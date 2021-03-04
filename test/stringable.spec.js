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
  assert.equal(typeof given.string('test'), 'object')
  isStr(assert, given.string('test'))
  assert.equal(typeof given.string('test').valueOf(), 'string')
  assert.equal(typeof given.string('test').toString(), 'string')
})

test('it returns instance of Stringable for existing methods', assert => {
  isStr(assert, given.string('test replace').replace('', ''))
  isStr(assert, given.string('test trim').trim())
  isStr(assert, given.string('test trimEnd').trimEnd())
  isStr(assert, given.string('test trimStart').trimStart())
  isStr(assert, given.string('test substr').substr(0))
  isStr(assert, given.string('test substring').substring(0))
  isStr(assert, given.string('test slice').slice(0))
  isStr(assert, given.string('test concat').concat('a'))
  isStr(assert, given.string('test repeat').repeat(2))
  isStr(assert, given.string('test repeat').repeat(2))
  isStr(assert, given.string('test toLocaleLowerCase').toLocaleLowerCase())
  isStr(assert, given.string('test toLocaleUpperCase').toLocaleUpperCase())
  isStr(assert, given.string('test toLowerCase').toLowerCase())
  isStr(assert, given.string('test toUpperCase').toUpperCase())
  isStr(assert, given.string('test charAt').charAt(1))
})

test('after() returns all remaining text after the first haystack', assert => {
  isStr(assert, given.string('').after('.'))
  assert.equal(given.string('michael@somemail.com').after('@'), 'somemail.com')
  assert.equal(given.string('michael1.michael2.@somemail.com').after('michael'), '1.michael2.@somemail.com')
  assert.equal(given.string('michael@somemail.com').after('nonexisting'), 'michael@somemail.com')
})

test('afterLast() returns all remaining text after the last haystack', assert => {
  isStr(assert, given.string('').afterLast('.'))
  assert.equal(given.string('michael@some.mail.com').afterLast('.'), 'com')
  assert.equal(given.string('michael1.michael2.@somemail.com').afterLast('michael'), '2.@somemail.com')
  assert.equal(given.string('michael@somemail.com').afterLast('com'), '')
  assert.equal(given.string('michael@somemail.com').afterLast('nonexisting'), 'michael@somemail.com')
})

test('before() returns all text before the first haystack', assert => {
  isStr(assert, given.string('').before('.'))
  assert.equal(given.string('michael@somemail.com').before('@'), 'michael')
  assert.equal(given.string('hi hello hi hello').before('hello'), 'hi ')
  assert.equal(given.string('michael@somemail.com').before('nonexisting'), 'michael@somemail.com')
})

test('beforeLast() returns all text before the last haystack', assert => {
  isStr(assert, given.string('').beforeLast('.'))
  assert.equal(given.string('michael@some.mail.com').beforeLast('.'), 'michael@some.mail')
  assert.equal(given.string('hi hello hi hello').beforeLast('hello'), 'hi hello hi ')
  assert.equal(given.string('michael@somemail.com').beforeLast('nonexisting'), 'michael@somemail.com')
})

test('fetches text between two points', assert => {
  isStr(assert, given.string('nested.sub.domain.com').between('.').and('.'))
  assert.equal(given.string('nested.sub.domain.com').between('.').and('.'), 'sub')
  assert.equal(given.string('hello@michael@some.mail.com').between('@').and('.'), 'michael@some')
  assert.equal(given.string('hello@michael@some.mail.com').between('@').andLast('.'), 'michael@some.mail')
  assert.equal(given.string('hello@michael@some.mail.com').betweenLast('@').and('.'), 'some')
  assert.equal(given.string('hello@michael@some.mail.com').betweenLast('@').andLast('.'), 'some.mail')
})

test('when() can apply modifications conditionally', assert => {
  const callback = str => str.append('ing')
  isStr(assert, given.string('test').when(true, () => 'not Str'))
  assert.equal(given.string('test').when(true, callback), 'testing')
  assert.equal(given.string('test').when(false, callback), 'test')
  assert.equal(given.string('test').when(str => str.is('test'), callback), 'testing')
  assert.equal(given.string('test').when(str => str.is('not test'), callback), 'test')
})

test('wrap() wraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, given.string('').wrap(':'))
  assert.equal(given.string('others').wrap('***'), '***others***')
  assert.equal(given.string('oldschool').wrap('<blink>', '</blink>'), '<blink>oldschool</blink>')
})

test('unwrap() unwraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, given.string('').unwrap(':'))
  assert.equal(given.string('***others***').unwrap('***'), 'others')
  assert.equal(given.string('others***').unwrap('***'), 'others')
  assert.equal(given.string('***others').unwrap('***'), 'others')
  assert.equal(given.string('others').unwrap('***'), 'others')
  assert.equal(given.string('<blink>oldschool</blink>').unwrap('<blink>', '</blink>'), 'oldschool')
})

test('append() concats a string to the existing one', assert => {
  isStr(assert, given.string('').append(':'))
  assert.equal(given.string('first').append('-second'), 'first-second')
})

test('prepend(), well, prepends a string to the existing one', assert => {
  isStr(assert, given.string('').prepend(':'))
  assert.equal(given.string('second').prepend('first-'), 'first-second')
})

test('is() compares the raw string against what gets passed in', assert => {
  assert.isTrue(given.string('first').is('first'))
  assert.isFalse(given.string('first').is('second'))
  assert.isFalse(given.string('').is(0))
})

test('includedIn() checks if string is included in array', assert => {
  assert.isTrue(given.string('first').includedIn(['first']))
  assert.isFalse(given.string('first').includedIn(['second']))
})

test('endWith() ends a string with what gets passed in if it does not already end with that string', assert => {
  isStr(assert, given.string('').endWith(':'))
  assert.equal(given.string('User').endWith('Controller'), 'UserController')
  assert.equal(given.string('UserController').endWith('Controller'), 'UserController')
})

test('startWith() starts a string with what gets passed in if it does not already start with that string', assert => {
  isStr(assert, given.string('').startWith(':'))
  assert.equal(given.string('User').startWith('Note: '), 'Note: User')
  assert.equal(given.string('Note: User').startWith('Note: '), 'Note: User')
})

test('limit() truncates a string and appends the second argument the string surpasses the limit', assert => {
  isStr(assert, given.string('it is a beautiful night').limit(5))
  assert.equal(given.string('it is a beautiful night').limit(5), 'it is...')
  assert.equal(given.string('it is a beautiful night').limit(50), 'it is a beautiful night')
  assert.equal(given.string('it is a beautiful night').limit(5, '(...)'), 'it is(...)')
  assert.equal(given.string('it is a beautiful night').limit(50, '...'), 'it is a beautiful night')

  // make sure we don't have off by 1 bug
  assert.equal(given.string('123').limit(2, '...'), '12...')
  assert.equal(given.string('123').limit(3, '...'), '123')
  assert.equal(given.string('123').limit(4, '...'), '123')
})

test('whenEmpty() can apply modifications conditionally if the string is empty ("")', assert => {
  isStr(assert, given.string('').whenEmpty(() => 'not Str'))
  const callback = str => str.append('replaced!')
  assert.equal(given.string('').whenEmpty(callback), 'replaced!')
  assert.equal(given.string('nope').whenEmpty(callback), 'nope')
})

test('pipe() calls the callback and lets you continue the chain', assert => {
  isStr(assert, given.string('hello').pipe(str => 'not Str!'))
  assert.equal(given.string('hello').pipe(str => str.append('!')), 'hello!')
})

test('kebab() and snake() turns string into respective case', assert => {
  isStr(assert, given.string('').snake())
  isStr(assert, given.string('').kebab())

  assert.equal(given.string('Foo BAR').kebab(), 'foo-bar')
  assert.equal(given.string('Foo BAR').snake(), 'foo_bar')
})

test('studly() turns string into respective case', assert => {
  isStr(assert, given.string('').studly())
  assert.equal(given.string('foo bar').studly(), 'FooBar')
  assert.equal(given.string('foo-BAR').studly(), 'FooBar')
})

test('camel() turns string into respective case', assert => {
  isStr(assert, given.string('').camel())
  assert.equal(given.string('--Foo-bAR--').camel(), 'fooBar')
})

test('title() turns string into respective case', assert => {
  isStr(assert, given.string('').title())
  assert.equal(given.string('foo bar').title(), 'Foo Bar')
  assert.equal(given.string('foo-bar').title(), 'Foo Bar')
  assert.equal(given.string('foo BAR').title(), 'Foo BAR')
})

test('capitalize() capitalizes the first character', assert => {
  isStr(assert, given.string('').capitalize())
  assert.equal(given.string('foo Bar').capitalize(), 'Foo Bar')
  assert.equal(given.string('FOO').capitalize(), 'FOO')
})

test('tap() lets you tap into the process without modifying the string', assert => {
  isStr(assert, given.string('').tap(() => 1))

  let wasCalled = false
  given.string('hello').tap(() => wasCalled = true)
  assert.isTrue(wasCalled)
  assert.equal(given.string('').tap(str => str.append('nope')), '')
  assert.equal(given.string('').tap(str => str.append('nope')).append('yup'), 'yup')
})

test('parse() converts a stringified version back into original', assert => {
  assert.equal(given.string('1').parse(), '1')
  assert.isTrue(given.string('true').parse())

  const stringified = JSON.stringify({ a: 1 })
  assert.deepEqual(given.string(stringified).parse(), { a: 1 })
})

test('slug() turns string into URI conform format', assert => {
  isStr(assert, given.string('Stringable Getting Started ♥').slug())
  assert.equal(given.string('Stringable Getting Started ♥').slug(), 'stringable-getting-started')
  assert.equal(given.string('Ä getting started').slug('+'), 'a+getting+started')
})
