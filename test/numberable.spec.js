const test = require('japa')
const { Numberable, givenNumber, Arrayable } = require('../dist')

function isNum(assert, result) {
  assert.instanceOf(result, Numberable)
}

test('times() loops and maps through callback x times', assert => {
  let count = 0
  const mapped = givenNumber(3).times(i => {
    count++
    return i
  })
  
  assert.instanceOf(mapped, Arrayable)
  assert.equal(count, 3)
  assert.deepEqual(mapped, [0, 1, 2])
})

test('can calculate with percentages', assert => {
  isNum(assert, givenNumber(40).percent().of(750))
  isNum(assert, givenNumber(40).percent())
  isNum(assert, givenNumber(40).inPercent())

  assert.equal(givenNumber(40).percent().of(750), 300) // 40 / 100 * 750
  assert.equal(givenNumber(300).of(750).inPercent(), 40) // 300 / 750 * 100
})

test('round(), ceil(), floor() calls respective Math class', assert => {
  isNum(assert, givenNumber(1).round(1))
  assert.equal(givenNumber(10.5).round(), Math.round(11))
  
  isNum(assert, givenNumber(1).ceil(1))
  assert.equal(givenNumber(10.5).ceil(), Math.round(11))
  
  isNum(assert, givenNumber(1).floor(1))
  assert.equal(givenNumber(10.5).floor(), Math.round(10))
})

test('pad() fills up number with zeroes', assert => {
  assert.equal(givenNumber(23).pad(3), '023')
  assert.equal(givenNumber(23).pad(5), '00023')
  assert.equal(givenNumber(23).pad(2), '23')
  assert.equal(givenNumber(23).pad(-1), '23')
})

test('ordinal() returns number with ordinal suffix', assert => {
  assert.equal(givenNumber(20).ordinal(), '20th')
  assert.equal(givenNumber(21).ordinal(), '21st')
  assert.equal(givenNumber(22).ordinal(), '22nd')
  assert.equal(givenNumber(23).ordinal(), '23rd')
  assert.equal(givenNumber(24).ordinal(), '24th')
  assert.equal(givenNumber(25).ordinal(), '25th')
})

test('isBetween() checks if the number is exclusively between the givenNumber start and end points', assert => {
  assert.isTrue(givenNumber(5).isBetween(1, 10))
  assert.isTrue(givenNumber(5).isBetween(4, 6))
  assert.isFalse(givenNumber(5).isBetween(6, 9))
  assert.isFalse(givenNumber(5).isBetween(1, 3))
  assert.isFalse(givenNumber(5).isBetween(1, 5))
  assert.isFalse(givenNumber(5).isBetween(5, 6))
})

test('isBetweenOr() checks if the number is inclusively between the givenNumber start and end points', assert => {
  assert.isTrue(givenNumber(5).isBetweenOr(1, 10))
  assert.isTrue(givenNumber(5).isBetweenOr(4, 6))
  assert.isFalse(givenNumber(5).isBetweenOr(6, 9))
  assert.isFalse(givenNumber(5).isBetweenOr(1, 3))
  assert.isTrue(givenNumber(5).isBetweenOr(1, 5))
  assert.isTrue(givenNumber(5).isBetweenOr(5, 6))
})