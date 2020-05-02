const test = require('japa')
const { Arrayable, Stringable, Numberable, Mappable, given } = require('../dist')

test('creates Arrayable out of array or other iterables (except maps and strings)', assert => {
  assert.instanceOf(given([]), Arrayable)
  assert.instanceOf(given(new Set([1, 2])), Arrayable)
})

test('creates Mappable out of maps or objects', assert => {
  assert.instanceOf(given({}), Mappable)
  assert.instanceOf(given(new Map()), Mappable)
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