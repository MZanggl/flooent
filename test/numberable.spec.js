const test = require('japa')
const { Numberable, given } = require('../dist')

function isNum(assert, result) {
  assert.instanceOf(result, Numberable)
}

test('map() loops and maps through callback x times', assert => {
  let count = 0
  const mapped = given(3).map(i => {
    count++
    return i
  })

  
  assert.equal(count, 3)
  assert.deepEqual(mapped, [0, 1, 2])
})

test('forEach() loops through callback x times', assert => {
  let count = 0
  const result = given(3).forEach(() => {
    count++
    return count // doesn't do anything
  })

  assert.equal(count, 3)
  isNum(assert, result)
})

test('can calculate the rule of three', assert => {
  assert.equal(given(300).percentOf(750), 40)
  assert.equal(given(40, '%').totalOf(300), 750)
  assert.equal(given(40, '%').fractionOf(750), 300)
})
