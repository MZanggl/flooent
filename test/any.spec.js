const test = require('japa')
const { given } = require('../dist')

test('do() returns the result of the callback', assert => {
  const result = given.any('hello'.toUpperCase()).do(hello => hello + '!!!')
  assert.equal(result, 'HELLO!!!')
})
