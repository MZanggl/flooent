const test = require('japa')
const { Arr, Str, from } = require('../dist')

test('creates Arrayable out of array', assert => {
  assert.instanceOf(from([]), Arr)
})

test('creates Stringable out of strings', assert => {
  assert.instanceOf(from(''), Str)
})