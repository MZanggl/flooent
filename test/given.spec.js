const test = require('japa')
const { givenString, givenArray, givenNumber } = require('../dist')

test('can extend flooent objects by replacing the types', assert => {
  givenString.macro('scream', function() {
    return this.toUpperCase()
  })

  givenArray.macro('stringify', function() {
    return this.toString()
  })

  givenNumber.macro('stringify', function() {
    return this.toString()
  })

  assert.equal(givenString('hello').scream(), 'HELLO')
  assert.equal(givenArray([1]).stringify(), '1')
  assert.equal(givenNumber(1).stringify(), '1')
})