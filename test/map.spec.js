const test = require('japa')
const { Mappable, given, Arrayable } = require('../dist')
const mapMethods = require('../dist/map')

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
}

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

test.group('map functions', () => {
  test('mapValues', (assert) => {
    const mapped = mapMethods.mapValues(new Map([['key', 'value']]), value => value.toUpperCase())
    assert.equal(mapped.get('key'), 'VALUE')
  })

  test('supports object in mapKeys function', (assert) => {
    const mapped = mapMethods.mapKeys(new Map([['key', 'value']]), (value, key) => key.toUpperCase())
    assert.equal(mapped.get('KEY'), 'value')
  })
})

test.group('Mappable', () => {
    test('pipe() calls the callback and lets you continue the chain', assert => {
      const newMap = given.map(new Map()).pipe(map => map.set(1, 2))
      isMap(assert, newMap)
      assert.equal(newMap.get(1), 2)
      assert.equal(given.map(new Map).pipe(() => false), false)
    })

    test('when() can apply modifications conditionally', assert => {
      const addItem = map => map.set(1, 2)
      isMap(assert, given.map(new Map).when(true, addItem))
      assert.equal(given.map(new Map).when(true, addItem).size, 1)
      assert.equal(given.map(new Map).when(false, addItem).size, 0)
      assert.equal(given.map(new Map).when(map => map.size === 0, addItem).size, 1)
      assert.equal(given.map(new Map).when(map => map.size === 1).size, 0)
    })

  test('turns nested map back into primitives after calling valueOf()', assert => {
    const parent = given.map(new Mappable()).set('child1', new Mappable())
    parent.get('child1').set('grandchild1', given.map(new Mappable()))
    const raw = parent.valueOf()

    assert.notInstanceOf(raw, Mappable)
    assert.notInstanceOf(raw.get('child1'), Mappable)
    assert.notInstanceOf(raw.get('child1').get('grandchild1'), Mappable)
  })

  test('it can create Mappable from Map or entries', (assert) => {
    isMap(assert, given.map(new Map([['key', 'value']])))
  
    assert.equal(given.map(new Map([['key', 'value']])).get('key'), 'value')
    assert.equal(given.map([['key', 'value']]).get('key'), 'value')
  })

  test('it can create Mappable from objects', (assert) => {
    isMap(assert, given.map.fromObject({ key: 'value' }))
  
    assert.equal(given.map.fromObject({ key: 'value' }).get('key'), 'value')
  
    // only first layer gets mapped
    assert.equal(given.map.fromObject({ user: { city: 'Munich' } }).get('user').city, 'Munich')
  })

  test('valueOf() returns the raw map', (assert) => {
    const map = new Mappable(new Map()).valueOf()
    assert.notInstanceOf(map, Mappable)
    assert.instanceOf(map, Map)
  })

  test('valueOf() returns the raw map', (assert) => {
    const map = new Mappable(new Map()).valueOf()
    assert.notInstanceOf(map, Mappable)
    assert.instanceOf(map, Map)
  })
  
  test('toObject() turns the map back into an object', assert => {
    assert.deepEqual(given.map.fromObject({ key: 'value' }).toObject(), { key: 'value' })
  })
  
  test('toKeys(), toValues() and toEntries() return instances of Arrayable', assert => {
    const map = given.map.fromObject({ key: 'value' })
    isArr(assert, map.toEntries())
    isArr(assert, map.toKeys())
    isArr(assert, map.toValues())
  })
  
  test('pull() returns the value for the given key and removes it from the map', assert => {
    const map = given.map.fromObject({ key: 'value' })
    assert.equal(map.pull('key'), 'value')
    assert.isFalse(map.has('key'))
  })
  
  test('mapKeys() iterates the entries through the given callback and assigns each result as the key', assert => {
    const map = given.map.fromObject({ a: 1 })
    const newMap = map.mapKeys((value, key) => key + value.toString())
    const indexMap = given.map.fromObject({ a: 1, b: 2 }).mapKeys((value, key, index) => index)
  
    assert.isTrue(newMap.has('a1'))
    assert.equal(newMap.get('a1'), 1)
    assert.deepEqual(indexMap.toKeys(), [0, 1])
  })
  
  test('mapValues() iterates the entries through the given callback and assigns each result as the value', assert => {
    const map = given.map.fromObject({ a: 1 })
    const newMap = map.mapValues((value, key) => key + value.toString())
    const indexMap = given.map.fromObject({ a: 1, b: 2 }).mapKeys((value, key, index) => index)
  
    assert.isTrue(newMap.has('a'))
    assert.equal(newMap.get('a'), 'a1')
    assert.deepEqual(indexMap.toKeys(), [0, 1])
  })
  
  test('arrange() arranges the map according to the given keys', assert => {
    const map = given.map.fromObject({ strings: 2, numbers: 1, functions: 4 })
    const arranged = map.arrange('numbers', 'functions')
  
    assert.deepEqual(map.toKeys(), ['strings', 'numbers', 'functions'])
    assert.deepEqual(arranged.toKeys(), ['numbers', 'functions', 'strings'])
  })
  
  test('only() returns a new map with only the given keys', assert => {
    const map = given.map.fromObject({ one: 1, two: 2, three: 3 }).only(['one', 'two'])
    assert.deepEqual(map.toKeys(), ['one', 'two'])
  })
  
  test('except() returns a new map with all keys except for the given keys', assert => {
    const map = given.map.fromObject({ one: 1, two: 2, three: 3 }).except(['one', 'two'])
    assert.deepEqual(map.toKeys(), ['three'])
  })
  
  test('rename() renames a key if found', assert => {
    const map = given.map.fromObject({ one: 1, to: 2, three: 3 }).rename('to', 'two')
    assert.deepEqual(map.toKeys(), ['one', 'two', 'three'])
  
    const map2 = given.map.fromObject({ one: 1, two: 2, three: 3 }).rename('for', 'four')
    assert.deepEqual(map2.toKeys(), ['one', 'two', 'three'])
  })
})