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

  assert.equal(given.string('hello').scream(), 'HELLO')
  assert.equal(given.array([1]).stringify(), '1')
})
