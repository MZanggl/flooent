const test = require('japa')
const { given } = require('../dist')

test('macros dont extend the native prototype', assert => {
  given.string.macro('scream', function() {
    return this.toUpperCase()
  })

  given.array.macro('stringify', function() {
    return this.toString()
  })

  assert.isUndefined(''.scream)
  assert.isUndefined([].stringify)
})

test('can extend flooent objects through macros', assert => {
  given.string.macro('scream', function() {
    return this.toUpperCase()
  })

  given.array.macro('stringify', function() {
    return this.toString()
  })

  given.number.macro('stringify', function() {
    return this.toString()
  })

  assert.equal(given.string('hello').scream(), 'HELLO')
  assert.equal(given.array([1]).stringify(), '1')
  assert.equal(given.number(1).stringify(), '1')
})

test('turns flooent variant back into raw value', assert => {
  assert.typeOf(given.string('hello', str => '!'), 'string')
  assert.typeOf(given.string('hello', str => 1), 'number')

  assert.typeOf(given.number(1, num => num + 1), 'number')
  assert.typeOf(given.number(1, num => ''), 'string')
})