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
  assert.deepEqual(given([1, 2]).first(2), [1, 2])
  assert.deepEqual(given([1, 2]).first(4), [1, 2])
})

test('second() returns second value in array or undefined', assert => {
  assert.equal(given([1, 2]).second(), 2)
  assert.isUndefined(given([]).second())
})

test('last() returns last value in array or undefined', assert => {
  assert.equal(given([1, 2]).last(), 2)
  assert.isUndefined(given([]).last())

  assert.deepEqual(given([1, 2]).last(1), [2])
  assert.deepEqual(given([1, 2, 3, 4]).last(2), [3, 4])
  assert.deepEqual(given([1, 2, 3, 4]).last(200), [1, 2, 3, 4])
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

test('whereNot() removes given value from array', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).whereNot(1))
  assert.deepEqual(given([1, 1,2 ]).whereNot(1), [2])
})

test('where() filters array by given value', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).where(1))
  assert.deepEqual(given([1, 1, 2 ]).where(1), [1, 1])
})

test('whereIn() filters array by given values', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).whereIn([1]))
  assert.deepEqual(given([1, 1, 2, 3 ]).whereIn([1, 2]), [1, 1, 2])
})

test('whereNotIn() removes given values from array', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).whereNotIn([1]))
  assert.deepEqual(given([1, 1, 2, 3 ]).whereNotIn([1, 2]), [3])
})

test('forget() omits the given keys from the object', assert => {
  const people = given([ { id: 1, age: 24, initials: 'mz' }, { id: 2, age: 64, initials: 'lz' } ])
  isArr(assert, people.forget('age'))
  assert.deepEqual(people.forget('initials'), [ { id: 1, age: 24 }, { id: 2, age: 64 } ])
  assert.deepEqual(people.forget(['initials', 'age']), [ { id: 1 }, { id: 2 } ])
})

test('whereNot() removes given value of given key from array', assert => {
  const cities = given([ { city: 'Ishigaki' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
  isArr(assert, cities.whereNot('city', 'Ishigaki'))
  assert.deepEqual(cities.whereNot('city', 'Ishigaki'), [{ city: 'Naha'}])
})

test('where() filters array by given key / value pair', assert => {
  const cities = given([ { city: 'Ishigaki' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
  isArr(assert, cities.where('city', 'Naha'))
  assert.deepEqual(cities.where('city', 'Naha'), [{ city: 'Naha'}])
})

test('whereIn() filters array by given key and values', assert => {
  const cities = given([ { city: 'Hokkaido' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
  isArr(assert, cities.whereIn('city', 'Naha'))
  assert.deepEqual(cities.whereIn('city', ['Naha', 'Hokkaido']), [{ city: 'Hokkaido'}, { city: 'Naha'}])
})

test('whereNotIn() filters out items in array by given key and values', assert => {
  const cities = given([ { city: 'Hokkaido' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
  isArr(assert, cities.whereNotIn('city', 'Naha'))
  assert.deepEqual(cities.whereNotIn('city', ['Naha', 'Hokkaido']), [{ city: 'Ishigaki' }])
})

test('unique() removes duplicate values', assert => {
  isArr(assert, given([1, 2, 3, 1, 2, 3]).unique())
  assert.deepEqual(given([1, 2, 3, 1, 2, 3]).unique(), [1, 2, 3])
})

test('unique() removes duplicate values by key when given', assert => {
  const cities = given([ { id: 1, city: 'Ishigaki' }, { city: 'Naha'}, { id: 3, city: 'Ishigaki' } ])
  isArr(assert, cities.unique('city'))
  assert.deepEqual(cities.unique('city'), [{ id: 1, city: 'Ishigaki' }, { city: 'Naha' }])
})

test('shuffle() shuffles the array randomly', assert => {
  const numbers = given([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  isArr(assert, numbers.shuffle())
  assert.notDeepEqual(numbers.shuffle(), numbers)
})

test('filled() only returns items that are not empty', assert => {
  isArr(assert, given([1]).filled())
  assert.deepEqual(given([1, 0, '', null, undefined, 2]).filled(), [1, 2])
})

test('groupBy() groups an array of object by the given key', assert => {
  const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
  const result = given(users).groupBy('area')

  isArr(assert, result.LA)
  assert.deepEqual(result, {
    'New York': [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}],
    'LA': [{ id: 3, area: 'LA' }]
  })
})

test('clone() copies an array recursively', assert => {
  const users = given([{ id: 1 }, { id: 2 }, { id: 3 }])
  const cloned = users.clone()

  isArr(assert, cloned)
  assert.notEqual(users[0], cloned[0])
  assert.deepEqual(users, cloned)
})

test('is() / squacksLike() deep-checks if the given value is the same', assert => {
  const users = given([{ id: 1 }, { id: 2 }, { id: 3 }])

  assert.isTrue(users.is([{ id: 1 }, { id: 2 }, { id: 3 }]))
  assert.isFalse(users.is([{ id: 1 }, { id: 2 }]))
  assert.isFalse(users.squacksLike([{ id: 11 }, { id: 2 }, { id: 3 }]))
})