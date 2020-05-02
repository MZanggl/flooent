const test = require('japa')
const { Arrayable, Mappable, given } = require('../dist')

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
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

  assert.deepEqual(given([1, 2, 3, 4]).last(i => i > 1), 4)
})

test('nth() returns value at given index in array or undefined', assert => {
  assert.equal(given([1, 2]).nth(1), 2)
  assert.isUndefined(given([]).nth(1))
  
  assert.equal(given([1, 2, 3]).nth(-1), 3)
  assert.isUndefined(given([1, 2]).nth(-5))
})

test('until() returns all elements that match the given truth test until the first one returns false', assert => {
  const array = given([1, 2, 3])

  isArr(assert, array.until(2))
  assert.deepEqual(array.until(item => item === 4), [1, 2, 3])
  assert.deepEqual(array.until(item => item === 2), [1])
  assert.deepEqual(array.until(2), [1])
  assert.deepEqual(array.until(item => item === 1), [])
})

test('isEmpty() returns whether or not the array is empty', assert => {
  assert.isTrue(given([]).isEmpty())
  assert.isFalse(given([1]).isEmpty())
})

test('pad() appends the remaining number of items to the array', assert => {
  isArr(assert, given([1]).pad(1, 1))
  assert.deepEqual(given([1]).pad(3, null), [1, null, null])
  assert.deepEqual(given([1, 2, 3]).pad(2, '!'), [1, 2, 3])
})

test('chunk() chunks the array into the given size', assert => {
  const array = given([1, 2, 3, 4, 5])
  isArr(assert, array.chunk(2)[0])
  isArr(assert, array.chunk(2))
  assert.deepEqual(array.chunk(3), [
    [1, 2, 3],
    [4, 5]
  ])
})

test('forPage() returns the items for the given page and size', assert => {
  const array = given(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k'])
  isArr(assert, array.forPage(1, 1))

  assert.deepEqual(array.forPage(2, 2), ['c', 'd'])
  assert.deepEqual(array.forPage(3, 4), ['i', 'k'])
  assert.deepEqual(array.forPage(9, 4), [])
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

test('unique() removes duplicate values by return value when callback when given', assert => {
  const cities = given([ { id: 1, city: 'ishigaki' }, { city: 'Naha'}, { id: 3, city: 'Ishigaki' } ])
  assert.deepEqual(cities.unique(item => item.city), cities)

  isArr(assert, cities.unique(item => item.city.toLowerCase()))
  assert.deepEqual(cities.unique(item => item.city.toLowerCase()), [{ id: 1, city: 'ishigaki' }, { city: 'Naha' }])
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

test('groupBy() groups an array of objects by the given key', assert => {
  const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
  const result = given(users).groupBy('area').toJSON()

  isArr(assert, result.LA)
  assert.deepEqual(result, {
    'New York': [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}],
    'LA': [{ id: 3, area: 'LA' }]
  })
})

test('groupBy() groups an array of object by the given key transformation', assert => {
  const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
  const result = given(users).groupBy(item => item.area.toLowerCase()).toJSON()

  isArr(assert, result.la)
  assert.deepEqual(result, {
    'new york': [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}],
    'la': [{ id: 3, area: 'LA' }]
  })
})

test('sum() sums all the values in the array', assert => {
  assert.equal(given([2, 2, 1]).sum(), 5)

  const users = [{ id: 1, points: 10 }, { id: 2, points: 10 }, { id: 3, points: 10 }]
  assert.equal(given(users).sum('points'), 30)
  assert.equal(given(users).sum(user => user.points * 10), 300)
})

test('when() can apply modifications conditionally', assert => {
  const callback = array => array.append('called')
  isArr(assert, given([]).when(true, () => [1]))

  assert.deepEqual(given([]).when(true, callback), ['called'])
  assert.deepEqual(given([]).when(false, callback), [])
  assert.deepEqual(given([]).when(array => array.is([]), callback), ['called'])
  assert.deepEqual(given([]).when(array => array.is(['called']), callback), [])
})

test('clone() copies an array recursively', assert => {
  const users = given([{ id: 1 }, { id: 2 }, { id: 3 }])
  const cloned = users.clone()

  isArr(assert, cloned)
  assert.notEqual(users[0], cloned[0])
  assert.deepEqual(users, cloned)
})

test('is() / quacksLike() deep-checks if the given value is the same', assert => {
  const users = given([{ id: 1 }, { id: 2 }, { id: 3 }])

  assert.isTrue(users.is([{ id: 1 }, { id: 2 }, { id: 3 }]))
  assert.isFalse(users.is([{ id: 1 }, { id: 2 }]))
  assert.isFalse(users.quacksLike([{ id: 11 }, { id: 2 }, { id: 3 }]))
})

test('partition() returns a tuple separating the items that pass the given truth test', assert => {
  const users = given([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: true }])

  const [activeUsers, inactiveUsers] = users.partition(user => user.active)
  isArr(assert, activeUsers)
  isArr(assert, inactiveUsers)

  assert.deepEqual(inactiveUsers, [{ id: 1, active: false }, { id: 2, active: false }])
  assert.deepEqual(activeUsers, [{ id: 3, active: true }])
})

test('prepend() prepends the given items to the array and returns the entire array', assert => {
  const numbers = given([2, 3])

  isArr(assert, numbers.prepend(0, 1))
  assert.deepEqual(numbers, [0, 1, 2, 3])
})

test('append() appends the given items to the array and returns the entire array', assert => {
  const numbers = given([0, 1])

  isArr(assert, numbers.append(2, 3))
  assert.deepEqual(numbers, [0, 1, 2, 3])
})

test('tap() lets you tap into the process without modifying the array', assert => {
  isArr(assert, given([]).tap(() => 1))

  let wasCalled = false
  given([]).tap(() => wasCalled = true)
  assert.isTrue(wasCalled)

  assert.deepEqual(given([]).tap(arr => 1), [])
})

test('pipe() calls the callback and lets you continue the chain', assert => {
  isArr(assert, given([]).pipe(array => [1]))
  assert.deepEqual(given([]).pipe(arr => arr.append(1)), [1])
})

test('sortAsc() and sortDesc() do not mutate original array and return arrayable', assert => {
  const numbers = given([3, 1, 2])
  isArr(assert, numbers.sortAsc())
  assert.deepEqual(numbers, [3, 1, 2])
  isArr(assert, numbers.sortDesc())
  assert.deepEqual(numbers, [3, 1, 2])

  const numberObject = given([{ val: 3 }, { val: 1 }, { val: 2 }])
  isArr(assert, numberObject.sortAsc('val'))
  assert.deepEqual(numberObject, [{ val: 3 }, { val: 1 }, { val: 2 }])
  isArr(assert, numberObject.sortDesc('val'))
  assert.deepEqual(numberObject, [{ val: 3 }, { val: 1 }, { val: 2 }])
})

test('sortAsc() and sortDesc() sort in the respective direction', assert => {
  const numbers = given([3, 1, 2])
  assert.deepEqual(numbers.sortAsc(), [1, 2, 3])
  assert.deepEqual(numbers.sortDesc(), [3, 2, 1])
  assert.deepEqual(given(['C', 'A', 'B']).sortAsc(), ['A', 'B', 'C'])
  assert.deepEqual(given(['C', 'A', 'B']).sortDesc(), ['C', 'B', 'A'])

  const numberObject = given([{ val: 3 }, { val: 1 }, { val: 2 }])
  assert.deepEqual(numberObject.sortAsc('val'), [{ val: 1 }, { val: 2 }, { val: 3 }])
  assert.deepEqual(numberObject.sortDesc('val'), [{ val: 3 }, { val: 2 }, { val: 1 }])
  assert.deepEqual(given([[0], [2], [1]]).sortAsc(0), [[0], [1], [2]])
  
  assert.deepEqual(numberObject.sortAsc(item => item.val), [{ val: 1 }, { val: 2 }, { val: 3 }])
  assert.deepEqual(numberObject.sortDesc(item => item.val), [{ val: 3 }, { val: 2 }, { val: 1 }])
})

test('can turn array into map', assert => {
  const mapTurnedMap = given({ key: 'value' }).entries().toMap()
  assert.equal(mapTurnedMap.get('key'), 'value')
  isMap(assert, mapTurnedMap)
})