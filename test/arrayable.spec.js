const test = require('japa')
const { Arrayable, Mappable, given } = require('../dist')

function isArr(assert, result, notSameAs) {
  assert.instanceOf(result, Arrayable)
  if (notSameAs) {
    assert.notEqual(notSameAs, result)
  }
}

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
}

test.group('Arrayable', () => {
  test('valueOf() returns the raw array', (assert) => {
    const array = Arrayable.from([1]).valueOf()
    assert.notInstanceOf(array, Arrayable)
    assert.instanceOf(array, Array)
  })

  test('it can create Arrayable from array', (assert) => {
    assert.deepEqual(Arrayable.from([1,2]), [1,2])
    assert.deepEqual(Arrayable.of(1,2), [1,2])
    assert.isTrue(Array.isArray(Arrayable.of(1,2)))
    isArr(assert, Arrayable.from([1,2]))
    isArr(assert, Arrayable.of(1,2))
  })
  
  test('first() returns first value in array or undefined', assert => {
    assert.equal(given.array([1, 2]).first(), 1)
    assert.isUndefined(given.array([]).first())
    assert.deepEqual(given.array([1, 2]).first(2), [1, 2])
    assert.deepEqual(given.array([1, 2]).first(4), [1, 2])
  })
  
  test('second() returns second value in array or undefined', assert => {
    assert.equal(given.array([1, 2]).second(), 2)
    assert.isUndefined(given.array([]).second())
  })
  
  test('last() returns last value in array or undefined', assert => {
    assert.equal(given.array([1, 2]).last(), 2)
    assert.isUndefined(given.array([]).last())
  
    assert.deepEqual(given.array([1, 2]).last(1), [2])
    assert.deepEqual(given.array([1, 2, 3, 4]).last(2), [3, 4])
    assert.deepEqual(given.array([1, 2, 3, 4]).last(200), [1, 2, 3, 4])
  
    assert.deepEqual(given.array([1, 2, 3, 4]).last(i => i > 1), 4)
  })
  
  test('nth() returns value at given index in array or undefined', assert => {
    assert.equal(given.array([1, 2]).nth(1), 2)
    assert.isUndefined(given.array([]).nth(1))
    
    assert.equal(given.array([1, 2, 3]).nth(-1), 3)
    assert.isUndefined(given.array([1, 2]).nth(-5))
  })
  
  test('until() returns all elements that match the given truth test until the first one returns false', assert => {
    const array = given.array([1, 2, 3])
  
    isArr(assert, array.until(2), array)
    assert.deepEqual(array.until(item => item === 4), [1, 2, 3])
    assert.deepEqual(array.until(item => item === 2), [1])
    assert.deepEqual(array.until(2), [1])
    assert.deepEqual(array.until(item => item === 1), [])
  })
  
  test('isEmpty() returns whether or not the array is empty', assert => {
    assert.isTrue(given.array([]).isEmpty())
    assert.isFalse(given.array([1]).isEmpty())
  })
  
  test('pad() appends the remaining number of items to the array', assert => {
    const array = given.array([1])
    isArr(assert, array.pad(1, 1), array)
    assert.deepEqual(array.pad(3, null), [1, null, null])
    assert.deepEqual(given.array([1, 2, 3]).pad(2, '!'), [1, 2, 3])
  })
  
  test('chunk() chunks the array into the given size', assert => {
    const array = given.array([1, 2, 3, 4, 5])
    isArr(assert, array.chunk(2), array)
    isArr(assert, array.chunk(2)[0])
    assert.deepEqual(array.chunk(3), [
      [1, 2, 3],
      [4, 5]
    ])
  })
  
  test('forPage() returns the items for the given page and size', assert => {
    const array = given.array(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k'])
    isArr(assert, array.forPage(1, 1), array)
  
    assert.deepEqual(array.forPage(2, 2), ['c', 'd'])
    assert.deepEqual(array.forPage(3, 4), ['i', 'k'])
    assert.deepEqual(array.forPage(9, 4), [])
  })
  
  test('pluck() returns all values for a given key', assert => {
    const array = given.array([ { id: 1}, { id: 2} ])
    isArr(assert, array.pluck('id'), array)
    assert.deepEqual(array.pluck('id'), [1, 2])
  })
  
  test('whereNot() removes given value from array', assert => {
    const array = given.array([1, 2, 3, 1, 2, 3])
    isArr(assert, given.array([1, 2, 3, 1, 2, 3]).whereNot(1), array)
    assert.deepEqual(given.array([1, 1,2 ]).whereNot(1), [2])
  })
  
  test('where() filters array by given value', assert => {
    const array = given.array([1, 2, 3, 1, 2, 3])
    isArr(assert, array.where(1), array)
    assert.deepEqual(given.array([1, 1, 2 ]).where(1), [1, 1])
  })
  
  test('whereIn() filters array by given values', assert => {
    const array = given.array([1, 2, 3, 1, 2, 3])
    isArr(assert, array.whereIn([1]), array)
    assert.deepEqual(given.array([1, 1, 2, 3 ]).whereIn([1, 2]), [1, 1, 2])
  })
  
  test('whereNotIn() removes given values from array', assert => {
    const array = given.array([1, 2, 3, 1, 2, 3])
    isArr(assert, array.whereNotIn([1]), array)
    assert.deepEqual(given.array([1, 1, 2, 3 ]).whereNotIn([1, 2]), [3])
  })
  
  test('omit() omits the given keys from the object', assert => {
    const people = given.array([ { id: 1, age: 24, initials: 'mz' }, { id: 2, age: 64, initials: 'lz' } ])
    isArr(assert, people.omit(['age']), people)
    assert.deepEqual(people.omit(['initials', 'age']), [ { id: 1 }, { id: 2 } ])
  })
  
  test('whereNot() removes given value of given key from array', assert => {
    const cities = given.array([ { city: 'Ishigaki' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
    isArr(assert, cities.whereNot('city', 'Ishigaki'), cities)
    assert.deepEqual(cities.whereNot('city', 'Ishigaki'), [{ city: 'Naha'}])
  })
  
  test('where() filters array by given key / value pair', assert => {
    const cities = given.array([ { city: 'Ishigaki' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
    isArr(assert, cities.where('city', 'Naha'), cities)
    assert.deepEqual(cities.where('city', 'Naha'), [{ city: 'Naha'}])
  })
  
  test('whereIn() filters array by given key and values', assert => {
    const cities = given.array([ { city: 'Hokkaido' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
    isArr(assert, cities.whereIn('city', 'Naha'), cities)
    assert.deepEqual(cities.whereIn('city', ['Naha', 'Hokkaido']), [{ city: 'Hokkaido'}, { city: 'Naha'}])
  })
  
  test('whereNotIn() filters out items in array by given key and values', assert => {
    const cities = given.array([ { city: 'Hokkaido' }, { city: 'Naha'}, { city: 'Ishigaki' } ])
    isArr(assert, cities.whereNotIn('city', 'Naha'), cities)
    assert.deepEqual(cities.whereNotIn('city', ['Naha', 'Hokkaido']), [{ city: 'Ishigaki' }])
  })
  
  test('unique() removes duplicate values', assert => {
    const array = given.array([1, 2, 3, 1, 2, 3])
    isArr(assert, array.unique(), array)
    assert.deepEqual(array.unique(), [1, 2, 3])
  })
  
  test('unique() removes duplicate values by key when given', assert => {
    const cities = given.array([ { id: 1, city: 'Ishigaki' }, { city: 'Naha'}, { id: 3, city: 'Ishigaki' } ])
    isArr(assert, cities.unique('city'), cities)
    assert.deepEqual(cities.unique('city'), [{ id: 1, city: 'Ishigaki' }, { city: 'Naha' }])
  })
  
  test('unique() removes duplicate values by return value when callback when given', assert => {
    const cities = given.array([ { id: 1, city: 'ishigaki' }, { city: 'Naha'}, { id: 3, city: 'Ishigaki' } ])
    assert.deepEqual(cities.unique(item => item.city), cities)
  
    isArr(assert, cities.unique(item => item.city.toLowerCase()), cities)
    assert.deepEqual(cities.unique(item => item.city.toLowerCase()), [{ id: 1, city: 'ishigaki' }, { city: 'Naha' }])
  })
  
  test('shuffle() shuffles the array randomly', assert => {
    const numbers = given.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    isArr(assert, numbers.shuffle(), numbers)
    assert.notDeepEqual(numbers.shuffle(), numbers)
  })
  
  test('filled() only returns items that are not empty', assert => {
    const array = given.array([1])
    isArr(assert, given.array(array).filled(), array)
    assert.deepEqual(given.array([1, 0, '', null, undefined, 2]).filled(), [1, 2])
  })
  
  test('groupBy() groups an array of objects by the given key', assert => {
    const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
    const result = given.array(users).groupBy('area').toJSON()
  
    isArr(assert, result.LA, users)
    assert.deepEqual(result, {
      'New York': [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}],
      'LA': [{ id: 3, area: 'LA' }]
    })
  })
  
  test('keyBy() keys an array of objects by the given key', assert => {
    const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
    const result = given.array(users).keyBy('area')
  
    isMap(assert, result)
    assert.deepEqual(result.toJSON(), {
      'New York': { id: 2, area: 'New York'},
      'LA': { id: 3, area: 'LA' }
    })
  })

  test('toKeyedMap() turns array into map with the items turning into keys of the map', assert => {
    const genres = ['music', 'tech']
    const map = given.array(genres).toKeyedMap(genre => genre.toUpperCase())

    assert.deepEqual(map.toJSON(), {
      music: 'MUSIC',
      tech: 'TECH'
    })

    const simpleMap = given.array(genres).toKeyedMap(0)

    assert.deepEqual(simpleMap.toJSON(), {
      music: 0,
      tech: 0
    })
  })
  
  test('groupBy() maintains key types', assert => {
    const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
    given.array(users).groupBy('area').keys().map(k => assert.equal(typeof k, 'string'))
    given.array(users).groupBy('id').keys().map(k => assert.equal(typeof k, 'number'))
  })
  
  test('groupBy() groups an array of object by the given key transformation', assert => {
    const users = [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}, { id: 3, area: 'LA' }]
    const result = given.array(users).groupBy(item => item.area.toLowerCase()).toJSON()
  
    isArr(assert, result.la)
    assert.deepEqual(result, {
      'new york': [{ id: 1, area: 'New York' }, { id: 2, area: 'New York'}],
      'la': [{ id: 3, area: 'LA' }]
    })
  })
  
  test('sum() sums all the values in the array', assert => {
    assert.equal(given.array([2, 2, 1]).sum(), 5)
  
    const users = [{ id: 1, points: 10 }, { id: 2, points: 10 }, { id: 3, points: 10 }]
    assert.equal(given.array(users).sum('points'), 30)
    assert.equal(given.array(users).sum(user => user.points * 10), 300)
  })
  
  test('when() can apply modifications conditionally', assert => {
    const callback = array => array.append('called')
    const array = given.array([])
    isArr(assert, array.when(true, () => [1]), array)
  
    assert.deepEqual(given.array([]).when(true, callback), ['called'])
    assert.deepEqual(given.array([]).when(false, callback), [])
    assert.deepEqual(given.array([]).when(array => true, callback), ['called'])
    assert.deepEqual(given.array([]).when(array => false, callback), [])
  })
  
  test('partition() returns a tuple separating the items that pass the given truth test', assert => {
    const users = given.array([{ id: 1, active: false }, { id: 2, active: false }, { id: 3, active: true }])
  
    const [activeUsers, inactiveUsers] = users.partition(user => user.active)
    isArr(assert, activeUsers, users)
    isArr(assert, inactiveUsers, users)
  
    assert.deepEqual(inactiveUsers, [{ id: 1, active: false }, { id: 2, active: false }])
    assert.deepEqual(activeUsers, [{ id: 3, active: true }])
  })
  
  test('prepend() prepends the given items to the array and returns the entire array', assert => {
    const numbers = given.array([2, 3])
  
    const result = numbers.prepend(0, 1)
    isArr(assert, result, numbers)
    assert.deepEqual(result, [0, 1, 2, 3])
  })
  
  test('append() appends the given items to the array and returns the entire array', assert => {
    const numbers = given.array([0, 1])
  
    const result = numbers.append(2, 3)
    isArr(assert, result, numbers)
    assert.deepEqual(result, [0, 1, 2, 3])
  })
  
  test('tap() lets you tap into the process without modifying the array', assert => {
    isArr(assert, given.array([]).tap(() => 1))
  
    let wasCalled = false
    given.array([]).tap(() => wasCalled = true)
    assert.isTrue(wasCalled)
  
    assert.deepEqual(given.array([]).tap(arr => 1), [])
  })
  
  test('pipe() calls the callback and lets you continue the chain', assert => {
    const array = given.array([])
    isArr(assert, array.pipe(array => [1]), array)
    assert.deepEqual(given.array([]).pipe(arr => arr.append(1)), [1])
    assert.deepEqual(given.array([]).pipe(arr => 1), 1)
  })
  
  test.group('sortAsc() and sortDesc()', group => {
    test('sorting does not mutate the original array and returns arrayable', assert => {
      const numbers = given.array([3, 1, 2])
      isArr(assert, numbers.sortAsc(), numbers)
      assert.deepEqual(numbers, [3, 1, 2])
      isArr(assert, numbers.sortDesc(), numbers)
      assert.deepEqual(numbers, [3, 1, 2])
    
      const numberObject = given.array([{ val: 3 }, { val: 1 }, { val: 2 }])
      isArr(assert, numberObject.sortAsc('val'), numberObject)
      assert.deepEqual(numberObject, [{ val: 3 }, { val: 1 }, { val: 2 }])
      isArr(assert, numberObject.sortDesc('val'), numberObject)
      assert.deepEqual(numberObject, [{ val: 3 }, { val: 1 }, { val: 2 }])
    })

    test('can sort simple numeric arrays', (assert) => {
      const numbers = given.array([3, 1, 2])
      assert.deepEqual(numbers.sortAsc(), [1, 2, 3])
      assert.deepEqual(numbers.sortDesc(), [3, 2, 1])
    })

    test('can sort simple string based arrays', (assert) => {
      const letters = given.array(['b', 'a', 'c'])
      assert.deepEqual(letters.sortAsc(), ['a', 'b', 'c'])
      assert.deepEqual(letters.sortDesc(), ['c', 'b', 'a'])
    })
    
    test('can sort arrays of objects by a numeric key', (assert) => {
      const array = given.array([{ val: 3 }, { val: 1 }, { val: 2 }])
      assert.deepEqual(array.sortAsc('val'), [{ val: 1 }, { val: 2 }, { val: 3 }])
      assert.deepEqual(array.sortDesc('val'), [{ val: 3 }, { val: 2 }, { val: 1 }])
    })

    test('can sort arrays of objects by a string', (assert) => {
      const array = given.array([{ val: 'c' }, { val: 'a' }, { val: 'b' }])
      assert.deepEqual(array.sortAsc('val'), [{ val: 'a' }, { val: 'b' }, { val: 'c' }])
      assert.deepEqual(array.sortDesc('val'), [{ val: 'c' }, { val: 'b' }, { val: 'a' }])
    })

    test('can sort arrays of objects by a date', (assert) => {
      const dates = given.array([
        { val: new Date(2022, 1, 1) },
        { val: new Date(2020, 1, 1) },
        { val: new Date(2021, 1, 1) }
      ])

      assert.deepEqual(dates.sortAsc('val'), [{ val: new Date(2020, 1, 1) }, { val: new Date(2021, 1, 1) }, { val: new Date(2022, 1, 1) }])
      assert.deepEqual(dates.sortDesc('val'), [{ val: new Date(2022, 1, 1) }, { val: new Date(2021, 1, 1) }, { val: new Date(2020, 1, 1) }])
    })
    
    test('can sort given a callback', assert => {    
      const numberObject = given.array([{ val: 3 }, { val: 1 }, { val: 2 }])
      assert.deepEqual(numberObject.sortAsc(item => item.val), [{ val: 1 }, { val: 2 }, { val: 3 }])
      assert.deepEqual(numberObject.sortDesc(item => item.val), [{ val: 3 }, { val: 2 }, { val: 1 }])
    })
  })
  
  test('can turn arrays into maps', assert => {
    const mapTurnedMap = given.map({ key: 'value' }).entries().toMap()
    assert.equal(mapTurnedMap.get('key'), 'value')
    isMap(assert, mapTurnedMap)
  })
  
  test.group('Pointer API', () => {
    test('can use deprecated "at" api', (assert) => {
      const array = given.array(['a', 'b', 'e'])
      let abcd = array.at(1).append('c', 'd')
      isArr(assert, abcd, array)
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd', 'e'])
    })

    test('can append items at specific pointer', (assert) => {
      const array = given.array(['a', 'b', 'e'])
      let abcd = array.point(1).append('c', 'd')
      isArr(assert, abcd, array)
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd', 'e'])
    
      abcd = given.array(['a', 'b', 'c']).point(-1).append('d')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    
      abcd = given.array(['a', 'c', 'd']).point(item => item === 'a').append('b')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    })
    
    test('can prepend items at specific pointer', (assert) => {
      const array = given.array(['a', 'b', 'e'])
      let abcd = array.point(2).prepend('c', 'd')
      isArr(assert, abcd, array)
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd', 'e'])
    
      abcd = given.array(['a', 'b', 'd']).point(-1).prepend('c')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    
      abcd = given.array(['b', 'c', 'd']).point(item => item === 'b').prepend('a')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    })
    
    test('can set value at specific pointer', (assert) => {
      const array = given.array(['a', 'b', 'c'])
      let update = array.point(1).set(item => item + 'b')
      isArr(assert, update, array)
      assert.deepEqual(update, ['a', 'bb', 'c'])
      assert.deepEqual(array, ['a', 'b', 'c'])
    
      abcd = given.array(['a', 'b', 'd']).point(-1).prepend('c')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    
      abcd = given.array(['b', 'c', 'd']).point(item => item === 'b').prepend('a')
      assert.deepEqual(abcd, ['a', 'b', 'c', 'd'])
    })

    test('can remove index at specific pointer', (assert) => {
      const original = given.array(['a', 'b', 'c'])
      const updated = original.point(1).remove()
      isArr(assert, updated, original)
      assert.deepEqual(updated, ['a', 'c'])
      assert.deepEqual(original, ['a', 'b', 'c'])
    })

    test('can split the array at specific pointer', (assert) => {
      const original = given.array(['a', 'is', 'c'])
      const [left, right] = original.point(1).split()
      isArr(assert, left, original)
      isArr(assert, right, original)
      assert.deepEqual(left, ['a'])
      assert.deepEqual(right, ['c'])
    })
  
    test('can read value from current position', assert => {
      const value = given.array(['a', 'b', 'c']).point(-1).value()
      assert.equal(value, 'c')
    })
  
    test('can step forward and backwards', assert => {
      assert.equal(given.array(['a', 'b', 'c']).point(0).step(1).value(), 'b')
      assert.equal(given.array(['a', 'b', 'c']).point(0).step(2).value(), 'c')
      assert.equal(given.array(['a', 'b', 'c']).point(0).step(-1).value(), 'c')
      assert.isUndefined(given.array(['a', 'b', 'c']).point(0).step(999).value())
      assert.isUndefined(given.array(['a', 'b', 'c']).point(0).step(-999).value())
    })
  })
  
  test('can mutate array', assert => {
    const array = given.array(['a', 'b', 'c'])
    array.mutate(arr => arr.append('d'))
    assert.deepEqual(array, ['a', 'b', 'c', 'd'])
  })
  
  test('reject() is the inverse of Array.filter', assert => {
    const array = given.array(['a', 'aa', 'b']).reject(item => item.startsWith('a'))
    assert.deepEqual(array, ['b'])
  
    const array2 = given.array(['a', 'aa', 'b']).reject((item, index) => index === 1)
    assert.deepEqual(array2, ['a', 'b'])
  })
  
  test('move() with position "after" moves an element inside the array after the target', assert => {
    assert.deepEqual(given.array(['b', 'a', 'c']).move(0, 'after', 1), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['c', 'a', 'b']).move(0, 'after', 5), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['a', 'c', 'b']).move(1, 'after', 2), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['a', 'c', 'b']).move(2, 'after', 0), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['a', 'b', 'c']).move(1, 'after', 1), ['a', 'b', 'c'])
  })
  
  test('move() with position "before" moves an element inside the array before the target', assert => {
    assert.deepEqual(given.array(['b', 'a', 'c']).move(1, 'before', 0), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['b', 'a', 'c']).move(1, 'before', -5), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['a', 'c', 'b']).move(2, 'before', 1), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['b', 'a', 'c']).move(0, 'before', 2), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['a', 'b', 'c']).move(1, 'before', 1), ['a', 'b', 'c'])
  })

  test('move() can specify "first" and "last" instead of indexes', assert => {
    assert.deepEqual(given.array(['b', 'a', 'c']).move('first', 'after', 1), ['a', 'b', 'c'])
    assert.deepEqual(given.array(['b', 'a', 'c']).move('first', 'after', 0), ['b', 'a', 'c'])
    assert.deepEqual(given.array(['c', 'a', 'b']).move('first', 'after', 'last'), ['a', 'b', 'c'])
  })
})