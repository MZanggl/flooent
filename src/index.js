import Stringable from './Stringable'
import Arrayable from './Arrayable'

function given(anyValue) {
  if (Array.isArray(anyValue)) {
    return Arrayable.from(anyValue)
  }

  return Stringable.from(anyValue)
}

export {
  given,
  Stringable,
  Arrayable,
}