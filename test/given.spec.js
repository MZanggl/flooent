const test = require('japa')
const { given } = require('../dist')
const { textChangeRangeIsUnchanged } = require('typescript')

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

test('returns result of callback of given.raw', assert => {
  const result = given.raw('hello'.toUpperCase(), hello => hello + '!!!')
  assert.equal(result, 'HELLO!!!')
})