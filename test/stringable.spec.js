const test = require('japa')
const { Stringable: Str, givenString } = require('../dist')

function isStr(assert, result) {
  assert.instanceOf(result, Str)
}

test('it can create Stringable from string', (assert) => {
  assert.equal(new Str('test'), 'test')
  isStr(assert, new Str('test'))
})

test('it can turn Stringable back into raw string', assert => {
  assert.equal(typeof givenString('test'), 'object')
  isStr(assert, givenString('test'))
  assert.equal(typeof givenString('test').valueOf(), 'string')
  assert.equal(typeof givenString('test').toString(), 'string')
})

test('it returns instance of Stringable for existing methods', assert => {
  isStr(assert, givenString('test replace').replace('', ''))
  isStr(assert, givenString('test trim').trim())
  isStr(assert, givenString('test trimEnd').trimEnd())
  isStr(assert, givenString('test trimStart').trimStart())
  isStr(assert, givenString('test substr').substr(0))
  isStr(assert, givenString('test substring').substring(0))
  isStr(assert, givenString('test slice').slice(0))
  isStr(assert, givenString('test concat').concat('a'))
  isStr(assert, givenString('test repeat').repeat(2))
  isStr(assert, givenString('test repeat').repeat(2))
  isStr(assert, givenString('test toLocaleLowerCase').toLocaleLowerCase())
  isStr(assert, givenString('test toLocaleUpperCase').toLocaleUpperCase())
  isStr(assert, givenString('test toLowerCase').toLowerCase())
  isStr(assert, givenString('test toUpperCase').toUpperCase())
  isStr(assert, givenString('test charAt').charAt(1))
  isStr(assert, givenString('test charCodeAt').charCodeAt(1))
})

test('after() returns all remaining text after the first haystack', assert => {
  isStr(assert, givenString('').after('.'))
  assert.equal(givenString('michael@somemail.com').after('@'), 'somemail.com')
  assert.equal(givenString('michael1.michael2.@somemail.com').after('michael'), '1.michael2.@somemail.com')
  assert.equal(givenString('michael@somemail.com').after('nonexisting'), 'michael@somemail.com')
})

test('afterLast() returns all remaining text after the last haystack', assert => {
  isStr(assert, givenString('').afterLast('.'))
  assert.equal(givenString('michael@some.mail.com').afterLast('.'), 'com')
  assert.equal(givenString('michael1.michael2.@somemail.com').afterLast('michael'), '2.@somemail.com')
  assert.equal(givenString('michael@somemail.com').afterLast('com'), '')
  assert.equal(givenString('michael@somemail.com').afterLast('nonexisting'), 'michael@somemail.com')
})

test('before() returns all text before the first haystack', assert => {
  isStr(assert, givenString('').before('.'))
  assert.equal(givenString('michael@somemail.com').before('@'), 'michael')
  assert.equal(givenString('hi hello hi hello').before('hello'), 'hi ')
  assert.equal(givenString('michael@somemail.com').before('nonexisting'), 'michael@somemail.com')
})

test('beforeLast() returns all text before the last haystack', assert => {
  isStr(assert, givenString('').beforeLast('.'))
  assert.equal(givenString('michael@some.mail.com').beforeLast('.'), 'michael@some.mail')
  assert.equal(givenString('hi hello hi hello').beforeLast('hello'), 'hi hello hi ')
  assert.equal(givenString('michael@somemail.com').beforeLast('nonexisting'), 'michael@somemail.com')
})

test('fetches text between two points', assert => {
  isStr(assert, givenString('nested.sub.domain.com').between('.').and('.'))
  assert.equal(givenString('nested.sub.domain.com').between('.').and('.'), 'sub')
  assert.equal(givenString('hello@michael@some.mail.com').between('@').and('.'), 'michael@some')
  assert.equal(givenString('hello@michael@some.mail.com').between('@').andLast('.'), 'michael@some.mail')
  assert.equal(givenString('hello@michael@some.mail.com').betweenLast('@').and('.'), 'some')
  assert.equal(givenString('hello@michael@some.mail.com').betweenLast('@').andLast('.'), 'some.mail')
})

test('when() can apply modifications conditionally', assert => {
  const callback = str => str.append('ing')
  isStr(assert, givenString('test').when(true, () => 'not Str'))
  assert.equal(givenString('test').when(true, callback), 'testing')
  assert.equal(givenString('test').when(false, callback), 'test')
  assert.equal(givenString('test').when(str => str.is('test'), callback), 'testing')
  assert.equal(givenString('test').when(str => str.is('not test'), callback), 'test')
})

test('wrap() wraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, givenString('').wrap(':'))
  assert.equal(givenString('others').wrap('***'), '***others***')
  assert.equal(givenString('oldschool').wrap('<blink>', '</blink>'), '<blink>oldschool</blink>')
})

test('unwrap() unwraps a string by the first (or possibly second) argument', assert => {
  isStr(assert, givenString('').unwrap(':'))
  assert.equal(givenString('***others***').unwrap('***'), 'others')
  assert.equal(givenString('others***').unwrap('***'), 'others')
  assert.equal(givenString('***others').unwrap('***'), 'others')
  assert.equal(givenString('others').unwrap('***'), 'others')
  assert.equal(givenString('<blink>oldschool</blink>').unwrap('<blink>', '</blink>'), 'oldschool')
})

test('append() concats a string to the existing one', assert => {
  isStr(assert, givenString('').append(':'))
  assert.equal(givenString('first').append('-second'), 'first-second')
})

test('prepend(), well, prepends a string to the existing one', assert => {
  isStr(assert, givenString('').prepend(':'))
  assert.equal(givenString('second').prepend('first-'), 'first-second')
})

test('is() compares the raw string against what gets passed in', assert => {
  assert.isTrue(givenString('first').is('first'))
  assert.isFalse(givenString('first').is('second'))
  assert.isFalse(givenString('').is(0))
})

test('includedIn() checks if string is included in array', assert => {
  assert.isTrue(givenString('first').includedIn(['first']))
  assert.isFalse(givenString('first').includedIn(['second']))
})

test('endWith() ends a string with what gets passed in if it does not already end with that string', assert => {
  isStr(assert, givenString('').endWith(':'))
  assert.equal(givenString('User').endWith('Controller'), 'UserController')
  assert.equal(givenString('UserController').endWith('Controller'), 'UserController')
})

test('startWith() starts a string with what gets passed in if it does not already start with that string', assert => {
  isStr(assert, givenString('').startWith(':'))
  assert.equal(givenString('User').startWith('Note: '), 'Note: User')
  assert.equal(givenString('Note: User').startWith('Note: '), 'Note: User')
})

test('limit() truncates a string and appends the second argument the string surpasses the limit', assert => {
  isStr(assert, givenString('it is a beautiful night').limit(5))
  assert.equal(givenString('it is a beautiful night').limit(5), 'it is...')
  assert.equal(givenString('it is a beautiful night').limit(50), 'it is a beautiful night')
  assert.equal(givenString('it is a beautiful night').limit(5, '(...)'), 'it is(...)')
  assert.equal(givenString('it is a beautiful night').limit(50, '...'), 'it is a beautiful night')

  // make sure we don't have off by 1 bug
  assert.equal(givenString('123').limit(2, '...'), '12...')
  assert.equal(givenString('123').limit(3, '...'), '123')
  assert.equal(givenString('123').limit(4, '...'), '123')
})

test('whenEmpty() can apply modifications conditionally if the string is empty ("")', assert => {
  isStr(assert, givenString('').whenEmpty(() => 'not Str'))
  const callback = str => str.append('replaced!')
  assert.equal(givenString('').whenEmpty(callback), 'replaced!')
  assert.equal(givenString('nope').whenEmpty(callback), 'nope')
})

test('pipe() calls the callback and lets you continue the chain', assert => {
  isStr(assert, givenString('hello').pipe(str => 'not Str!'))
  assert.equal(givenString('hello').pipe(str => str.append('!')), 'hello!')
})

test('title() turns string into respective case', assert => {
  isStr(assert, givenString('').title())

  assert.equal(givenString('foo bar').title(), 'Foo Bar')
  assert.equal(givenString('foo BAR').title(), 'Foo BAR')
})

test('capitalize() capitalizes the first character', assert => {
  isStr(assert, givenString('').capitalize())
  assert.equal(givenString('foo Bar').capitalize(), 'Foo Bar')
  assert.equal(givenString('FOO').capitalize(), 'FOO')
})

test('tap() lets you tap into the process without modifying the string', assert => {
  isStr(assert, givenString('').tap(() => 1))

  let wasCalled = false
  givenString('hello').tap(() => wasCalled = true)
  assert.isTrue(wasCalled)
  assert.equal(givenString('').tap(str => str.append('nope')), '')
  assert.equal(givenString('').tap(str => str.append('nope')).append('yup'), 'yup')
})

test('parse() converts a stringified version back into original', assert => {
  assert.equal(givenString('1').parse(), '1')
  assert.isTrue(givenString('true').parse())

  const stringified = JSON.stringify({ a: 1 })
  assert.deepEqual(givenString(stringified).parse(), { a: 1 })
})

test('slugify() turns string into URL friendly format', assert => {
  isStr(assert, givenString('Stringable Getting Started ♥').slug())
  assert.equal(givenString('Stringable Getting Started ♥').slug(), 'stringable-getting-started')
  assert.equal(givenString('Ä getting started').slug('+'), 'a+getting+started')
})
