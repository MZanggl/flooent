const test = require('japa')
const { Arrayable, Stringable, Numberable, given } = require('../dist')

test('creates Arrayable out of array', assert => {
  assert.instanceOf(given([]), Arrayable)
})

test('creates Stringable out of strings', assert => {
  assert.instanceOf(given(''), Stringable)
})

test('creates Numberable out of numbers', assert => {
  assert.instanceOf(given(2), Numberable)
})

test('can pass callback which will call valueOf() at the end', assert => {
  assert.notInstanceOf(given(2, num => num), Numberable)
  assert.equal(given(2, num => num), 2)

  assert.instanceOf(given([], arr => arr), Arrayable)
  assert.deepEqual(given([], arr => arr), [])
})

test('can extend flooent objects by replacing the types', assert => {
  given.macro(String, 'scream', function() {
    return this.toUpperCase()
  })

  given.macro(Array, 'stringify', function() {
    return this.toString()
  })

  given.macro(Number, 'stringify', function() {
    return this.toString()
  })

  assert.equal(given('hello').scream(), 'HELLO')
  assert.equal(given([1]).stringify(), '1')
  assert.equal(given(1).stringify(), '1')
})