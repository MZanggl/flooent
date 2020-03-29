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

test('can calculate with percentages', assert => {
  isNum(assert, given(40).percent().of(750))
  isNum(assert, given(40).percent())
  isNum(assert, given(40).inPercent())

  assert.equal(given(40).percent().of(750), 300) // 40 / 100 * 750
  assert.equal(given(300).of(750).inPercent(), 40) // 300 / 750 * 100
})

test('max(), min(), round(), ceil(), floor() calls respective Math class', assert => {
  isNum(assert, given(1).max(1))
  assert.equal(given(10).max(50, 60), 60)
  assert.equal(given(10).max(1), 10)
  
  isNum(assert, given(1).min(1))
  assert.equal(given(10).min(50, 60), 10)
  assert.equal(given(10).min(5), 5)
  
  isNum(assert, given(1).round(1))
  assert.equal(given(10.5).round(), Math.round(11))
  
  isNum(assert, given(1).ceil(1))
  assert.equal(given(10.5).ceil(), Math.round(11))
  
  isNum(assert, given(1).floor(1))
  assert.equal(given(10.5).floor(), Math.round(10))
})
