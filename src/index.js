import Stringable from './Stringable'
import Arrayable from './Arrayable'

function from(anyValue) {
  if (Array.isArray(anyValue)) {
    return Arrayable.from(anyValue)
  }

  return Stringable.from(anyValue)
}

export {
  from,
  Stringable as Str,
  Arrayable as Arr,
}