// @ts-checkTODO

const test = require('japa')
const objMethods = require('../dist/object')

test.group('objects', () => {
  test('pull() returns the value for the given key and removes it from the object', assert => {
    const obj = { key: 'value', key2: 'value2' }
    assert.equal(objMethods.pull(obj, 'key'), 'value');
    assert.deepEqual(obj, { key2: 'value2'})
  })

  test('mapValues() iterates the entries through the given callback and assigns each result as the value', (assert) => {
    const mapped2 = objMethods.mapValues({ key: 'value' }, value => value.toUpperCase())
    assert.deepEqual(mapped2, {key: "VALUE" })
  })

  test('mapKeys() iterates the entries through the given callback and assigns each result as the key', (assert) => {
    const mapped2 = objMethods.mapKeys({ key: 'value' }, (value, key) => key.toUpperCase())
    assert.deepEqual(mapped2, { KEY: "value" })
  })

  test('only() returns a new map with only the given keys', assert => {
    const obj = objMethods.only({ one: 1, two: 2, three: 3 }, ['one', 'two'])
    assert.deepEqual(obj, { one: 1, two: 2 })
  })
  
  test('except() returns a new map with all keys except for the given keys', assert => {
    const obj = objMethods.except({ one: 1, two: 2, three: 3 }, ['one', 'two'])
    assert.deepEqual(obj, { three: 3 })
  })
  
  test('rename() renames a key if found', assert => {
    const obj = objMethods.rename({ one: 1, to: 2, three: 3 }, 'to', 'two')
    assert.deepEqual(obj, { one: 1, two: 2, three: 3 })
  
    const obj2 = objMethods.rename({ one: 1, two: 2, three: 3 }, 'for', 'four')
    assert.deepEqual(obj2, { one: 1, two: 2, three: 3 })
  })
})