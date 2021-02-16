const test = require('japa')
const { Mappable, given, Arrayable } = require('../dist')

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
}

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

test('it can create Mappable from Map or object', (assert) => {
  isMap(assert, given.map(new Map([['key', 'value']])))
  isMap(assert, given.map({ key: 'value' }))

  assert.equal(given.map({ key: 'value' }).get('key'), 'value')
  assert.equal(given.map(new Map([['key', 'value']])).get('key'), 'value')
  assert.equal(given.map([['key', 'value']]).get('key'), 'value')

  // only first layer gets mapped
  assert.equal(given.map({ user: { city: 'Munich' } }).get('user').city, 'Munich')
})

test('toJSON() turns the map back into an object', assert => {
  assert.deepEqual(given.map({ key: 'value' }).toJSON(), { key: 'value' })
})

test('keys(), values() and entries() return instances of Arrayable', assert => {
  const map = given.map({ key: 'value' })
  isArr(assert, map.entries())
  isArr(assert, map.keys())
  isArr(assert, map.values())
})

test('pull() returns the value for the given key and removes it from the map', assert => {
  const map = given.map({ key: 'value' })
  assert.equal(map.pull('key'), 'value')
  assert.isFalse(map.has('key'))
})

test('mapKeys() iterates the entries through the given callback and assigns each result as the key', assert => {
  const map = given.map({ a: 1 })
  const newMap = map.mapKeys((value, key) => key + value)

  assert.isTrue(newMap.has('a1'))
  assert.equal(newMap.get('a1'), 1)
})

test('mapValues() iterates the entries through the given callback and assigns each result as the value', assert => {
  const map = given.map({ a: '1' })
  const newMap = map.mapValues((value, key) => key + value)

  assert.isTrue(newMap.has('a'))
  assert.equal(newMap.get('a'), 'a1')
})

test('arrange() arranges the map according to the given keys', assert => {
  const map = given.map({ strings: 2, numbers: 1, functions: 4 })
  const arranged = map.arrange('numbers', 'functions')

  assert.deepEqual(map.keys(), ['strings', 'numbers', 'functions'])
  assert.deepEqual(arranged.keys(), ['numbers', 'functions', 'strings'])
})

test('only() returns a new map with only the given keys', assert => {
  const map = given.map({ one: 1, two: 2, three: 3 }).only(['one', 'two'])
  assert.deepEqual(map.keys(), ['one', 'two'])
})

test('except() returns a new map with all keys except for the given keys', assert => {
  const map = given.map({ one: 1, two: 2, three: 3 }).except(['one', 'two'])
  assert.deepEqual(map.keys(), ['three'])
})

test('rename() renames a key if found', assert => {
  const map = given.map({ one: 1, to: 2, three: 3 }).rename('to', 'two')
  assert.deepEqual(map.keys(), ['one', 'two', 'three'])

  const map2 = given.map({ one: 1, two: 2, three: 3 }).rename('for', 'four')
  assert.deepEqual(map2.keys(), ['one', 'two', 'three'])
})