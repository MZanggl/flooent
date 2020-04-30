const test = require('japa')
const { Mappable, given } = require('../dist')

function isMap(assert, result) {
  assert.instanceOf(result, Mappable)
}

test('it can create Mappable from Map or object', (assert) => {
  isMap(assert, given(new Map([['key', 'value']])))
  isMap(assert, given({ key: 'value' }))

  assert.equal(given({ key: 'value' }).get('key'), 'value')
  assert.equal(given(new Map([['key', 'value']])).get('key'), 'value')
})

test('toJSON() turns the map back into an object', assert => {
  assert.deepEqual(given({ key: 'value' }).toJSON(), { key: 'value' })
})