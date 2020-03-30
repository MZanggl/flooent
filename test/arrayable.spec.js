const test = require('japa')
const { Arrayable, given } = require('../dist')

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

test('it can create Arrayable from array', (assert) => {
  assert.deepEqual(Arrayable.from([1,2]), [1,2])
  assert.deepEqual(Arrayable.of(1,2), [1,2])
  assert.isTrue(Array.isArray(Arrayable.of(1,2)))
  isArr(assert, Arrayable.from([1,2]))
  isArr(assert, Arrayable.of(1,2))
})

test('first() returns first value in array or undefined', assert => {
  assert.equal(given([1, 2]).first(), 1)
  assert.isUndefined(given([]).first())
})

test('second() returns second value in array or undefined', assert => {
  assert.equal(given([1, 2]).second(), 2)
  assert.isUndefined(given([]).second())
})

test('last() returns last value in array or undefined', assert => {
  assert.equal(given([1, 2]).last(), 2)
  assert.isUndefined(given([]).last())
})

test('nth() returns value at given index in array or undefined', assert => {
  assert.equal(given([1, 2]).nth(1), 2)
  assert.isUndefined(given([]).nth(1))
  
  assert.equal(given([1, 2, 3]).nth(-1), 3)
  assert.isUndefined(given([1, 2]).nth(-5))
})

test('pluck() returns all values for a given key', assert => {
  const array = given([ { id: 1}, { id: 2} ])
  isArr(assert, array.pluck('id'))
  assert.deepEqual(array.pluck('id'), [1, 2])
})

test('forget() removes given value from array', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).forget(1))
  assert.deepEqual(given([1, 1,2 ]).forget(1), [2])
})

test('forgetBy() removes given value of given key from array', assert => {
  const cities = given([ { city: 'Ishigaki' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
  isArr(assert, given(cities).forgetBy('city', 'Ishigaki'))
  assert.deepEqual(given(cities).forgetBy('city', 'Ishigaki'), [{ city: 'Naha'}])
})

test('unique() removes duplicate values', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).unique())
  assert.deepEqual(given([1, 2, 3, 1, 2, 3]).unique(), [1, 2, 3])
})
