const test = require('japa')
const { Mappable, given, Arrayable } = require('../dist')

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
}

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

test('it can create Mappable from Map or object', (assert) => {
  isMap(assert, given(new Map([['key', 'value']])))
  isMap(assert, given({ key: 'value' }))

  assert.equal(given({ key: 'value' }).get('key'), 'value')
  assert.equal(given(new Map([['key', 'value']])).get('key'), 'value')
  assert.equal(new Mappable([['key', 'value']]).get('key'), 'value')

  // only first layer gets mapped
  assert.equal(given({ user: { city: 'Munich' } }).get('user').city, 'Munich')
})

test('toJSON() turns the map back into an object', assert => {
  assert.deepEqual(given({ key: 'value' }).toJSON(), { key: 'value' })
})

test('keys(), values() and entries() return instances of Arrayable', assert => {
  const map = given({ key: 'value' })
  isArr(assert, map.entries())
  isArr(assert, map.keys())
  isArr(assert, map.values())
})

test('pull() returns the value for the given key and removes it from the map', assert => {
  const map = given({ key: 'value' })
  assert.equal(map.pull('key'), 'value')
  assert.isFalse(map.has('key'))
})

test('mapKeys() iterates the entries through the given callback and assigns each result as the key', assert => {
  const map = given({ a: 1 })
  const newMap = map.mapKeys((value, key) => key + value)

  assert.isTrue(newMap.has('a1'))
  assert.equal(newMap.get('a1'), 1)
})

test('mapValues() iterates the entries through the given callback and assigns each result as the value', assert => {
  const map = given({ a: '1' })
  const newMap = map.mapValues((value, key) => key + value)

  assert.isTrue(newMap.has('a'))
  assert.equal(newMap.get('a'), 'a1')
})