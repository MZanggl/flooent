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