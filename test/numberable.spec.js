const test = require('japa')
const { Numberable, given, Arrayable } = require('../dist')

function isNum(assert, result) {
  assert.instanceOf(result, Numberable)
}

function isArr(assert, result) {
  assert.instanceOf(result, Arrayable)
}

test('times() loops and maps through callback x times', assert => {
  let count = 0
  const mapped = given(3).times(i => {
    count++
    return i
  })

  
  isArr(assert, mapped)
  assert.equal(count, 3)
  assert.deepEqual(mapped, [0, 1, 2])
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

test('pad() fills up number with zeroes', assert => {
  assert.equal(given(23).pad(3), '023')
  assert.equal(given(23).pad(5), '00023')
  assert.equal(given(23).pad(2), '23')
  assert.equal(given(23).pad(-1), '23')
})

test('ordinal() returns number with ordinal suffix', assert => {
  assert.equal(given(20).ordinal(), '20th')
  assert.equal(given(21).ordinal(), '21st')
  assert.equal(given(22).ordinal(), '22nd')
  assert.equal(given(23).ordinal(), '23rd')
  assert.equal(given(24).ordinal(), '24th')
  assert.equal(given(25).ordinal(), '25th')
})

test('isBetween() checks if the number is exclusively between the given start and end points', assert => {
  assert.isTrue(given(5).isBetween(1, 10))
  assert.isTrue(given(5).isBetween(4, 6))
  assert.isFalse(given(5).isBetween(6, 9))
  assert.isFalse(given(5).isBetween(1, 3))
  assert.isFalse(given(5).isBetween(1, 5))
  assert.isFalse(given(5).isBetween(5, 6))
})

test('isBetweenOr() checks if the number is inclusively between the given start and end points', assert => {
  assert.isTrue(given(5).isBetweenOr(1, 10))
  assert.isTrue(given(5).isBetweenOr(4, 6))
  assert.isFalse(given(5).isBetweenOr(6, 9))
  assert.isFalse(given(5).isBetweenOr(1, 3))
  assert.isTrue(given(5).isBetweenOr(1, 5))
  assert.isTrue(given(5).isBetweenOr(5, 6))
})