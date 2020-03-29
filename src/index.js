import Stringable from './Stringable'
import Arrayable from './Arrayable'
import Numberable from './Numberable'

function given(anyValue, callback, ...options) {
  let result
  if (Array.isArray(anyValue)) {
    result = Arrayable.from(anyValue)
  } else if (typeof anyValue === 'number') {
    result = new Numberable(anyValue, ...options)
  } else {
    result = Stringable.from(anyValue)
  }

  if (!callback) {
    return result
  }

  const callbackResult = callback(result)
  if (callbackResult instanceof Stringable || callbackResult instanceof Numberable) {
    return callbackResult.valueOf()
  }

  return callbackResult
}

export {
  given,
  Stringable,
  Arrayable,
  Numberable,
}