const test = require('japa')
const { Arrayable: Arr } = require('../dist')

function isArr(assert, result) {
  assert.instanceOf(result, Arr)
}

test('it can create Arrayable from array', (assert) => {
  assert.deepEqual(Arr.from([1,2]), [1,2])
  assert.deepEqual(Arr.of(1,2), [1,2])
  assert.isTrue(Array.isArray(Arr.of(1,2)))
  isArr(assert, Arr.from([1,2]))
  isArr(assert, Arr.of(1,2))
})

test('first() returns first value in array or undefined', assert => {
  assert.equal(Arr.from([1, 2]).first(), 1)
  assert.isUndefined(Arr.from([]).first())
})

test('last() returns last value in array or undefined', assert => {
  assert.equal(Arr.from([1, 2]).last(), 2)
  assert.isUndefined(Arr.from([]).last())
})


test('pluck() returns all values for a given key', assert => {
  const array = Arr.from([ { id: 1}, { id: 2} ])
  isArr(assert, array.pluck('id'))
  assert.deepEqual(array.pluck('id'), [1, 2])
})
