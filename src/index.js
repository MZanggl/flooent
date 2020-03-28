import Stringable from './Stringable'
import Arrayable from './Arrayable'
import Numberable from './Numberable'

function given(anyValue, ...options) {
  if (Array.isArray(anyValue)) {
    return Arrayable.from(anyValue)
  }
  if (typeof anyValue === 'number') {
    return new Numberable(anyValue, ...options)
  }

  return Stringable.from(anyValue)
}

export {
  given,
  Stringable,
  Arrayable,
  Numberable,
}