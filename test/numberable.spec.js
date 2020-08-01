const test = require('japa')
const { Numberable, given, Arrayable } = require('../dist')

function isNum(assert, result) {
  assert.instanceOf(result, Numberable)
}

test('times() loops and maps through callback x times', assert => {
  let count = 0
  const mapped = given.number(3).times(i => {
    count++
    return i
  })
  
  assert.instanceOf(mapped, Arrayable)
  assert.equal(count, 3)
  assert.deepEqual(mapped, [0, 1, 2])
})

test('can calculate with percentages', assert => {
  isNum(assert, given.number(40).percent().of(750))
  isNum(assert, given.number(40).percent())
  isNum(assert, given.number(40).inPercent())

  assert.equal(given.number(40).percent().of(750), 300) // 40 / 100 * 750
  assert.equal(given.number(300).of(750).inPercent(), 40) // 300 / 750 * 100
})

test('round(), ceil(), floor() calls respective Math class', assert => {
  isNum(assert, given.number(1).round(1))
  assert.equal(given.number(10.5).round(), Math.round(11))
  
  isNum(assert, given.number(1).ceil(1))
  assert.equal(given.number(10.5).ceil(), Math.round(11))
  
  isNum(assert, given.number(1).floor(1))
  assert.equal(given.number(10.5).floor(), Math.round(10))
})

test('pad() fills up number with zeroes', assert => {
  assert.equal(given.number(23).pad(3), '023')
  assert.equal(given.number(23).pad(5), '00023')
  assert.equal(given.number(23).pad(2), '23')
  assert.equal(given.number(23).pad(-1), '23')
})

test('ordinal() returns number with ordinal suffix', assert => {
  assert.equal(given.number(20).ordinal(), '20th')
  assert.equal(given.number(21).ordinal(), '21st')
  assert.equal(given.number(22).ordinal(), '22nd')
  assert.equal(given.number(23).ordinal(), '23rd')
  assert.equal(given.number(24).ordinal(), '24th')
  assert.equal(given.number(25).ordinal(), '25th')
})

test('isBetween() checks if the number is exclusively between the given.number start and end points', assert => {
  assert.isTrue(given.number(5).isBetween(1, 10))
  assert.isTrue(given.number(5).isBetween(4, 6))
  assert.isFalse(given.number(5).isBetween(6, 9))
  assert.isFalse(given.number(5).isBetween(1, 3))
  assert.isFalse(given.number(5).isBetween(1, 5))
  assert.isFalse(given.number(5).isBetween(5, 6))
})

test('isBetweenOr() checks if the number is inclusively between the given.number start and end points', assert => {
  assert.isTrue(given.number(5).isBetweenOr(1, 10))
  assert.isTrue(given.number(5).isBetweenOr(4, 6))
  assert.isFalse(given.number(5).isBetweenOr(6, 9))
  assert.isFalse(given.number(5).isBetweenOr(1, 3))
  assert.isTrue(given.number(5).isBetweenOr(1, 5))
  assert.isTrue(given.number(5).isBetweenOr(5, 6))
})