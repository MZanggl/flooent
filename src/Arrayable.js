import * as pull from 'lodash.pull'
import * as uniq from 'lodash.uniq'
import * as shuffle from 'lodash.shuffle'

class Arrayable extends Array {
  first() {
    return this.length > 0 ? this[0] : undefined
  }

  second() {
    return this.length > 1 ? this[1] : undefined
  }
  
  last() {
    return this.length > 0 ? this[this.length - 1] : undefined
  }

  nth(index) {
    if (index < 0) {
      index = this.length + index
    }
    return this.length - 1 >= index ? this[index] : undefined
  }

  forget(value) {
    return pull(this, value)
  }

  forgetBy(key, value) {
    return this.filter(item => item[key] !== value)
  }

  pluck(key) {
    return this.map(item => item[key])
  }

  unique() {
    return this.constructor.from(uniq(this))
  }

  shuffle() {
    return this.constructor.from(shuffle(this))
  }
}

export default Arrayable
