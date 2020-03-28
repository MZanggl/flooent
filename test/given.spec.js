const test = require('japa')
const { Arrayable, Stringable, given } = require('../dist')

test('creates Arrayable out of array', assert => {
  assert.instanceOf(given([]), Arrayable)
})

test('creates Stringable out of strings', assert => {
  assert.instanceOf(given(''), Stringable)
})