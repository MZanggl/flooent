import * as pull from 'lodash.pull'
import * as uniq from 'lodash.uniq'
import * as uniqby from 'lodash.uniqby'
import * as shuffle from 'lodash.shuffle'
import * as omit from 'lodash.omit'
import * as clonedeep from 'lodash.clonedeep'
import * as isequal from 'lodash.isequal'

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

  whereNot(key, value = key) {
    if (arguments.length === 1) {
      return this.filter(item => item !== value)
    }

    return this.filter(item => item[key] !== value)
  }

  where(key, value = key) {
    if (arguments.length === 1) {
      return this.filter(item => item === value)
    }

    return this.filter(item => item[key] === value)
  }

  whereIn(key, value = key) {
    if (arguments.length === 1) {
      return this.filter(item => value.includes(item))
    }

    return this.filter(item => value.includes(item[key]))
  }

  whereNotIn(key, value = key) {
    if (arguments.length === 1) {
      return this.filter(item => !value.includes(item))
    }

    return this.filter(item => !value.includes(item[key]))
  }

  filled(key) {
    if (!key) {
      return this.filter(value => !!value)
    }

    return this.filter(item => !!item[key])
  }

  clone() {
    // lodash does array.constructor(lenght) which doesn't work on subclassed arrays
    return this.constructor.from(clonedeep([...this]))
  }

  groupBy(key) {
    return this.reduce((result, item) => {
      result[item[key]] = result[item[key]] || new this.constructor
      result[item[key]].push(item)
      return result
    }, {})
  }

  forget(keys) {
    keys = Array.isArray(keys) ? keys : [keys]
    return this.map(item => {
      return omit(item, keys)
    })
  }

  pluck(key) {
    return this.map(item => item[key])
  }

  unique(key) {
    if (!key) {
      return this.constructor.from(uniq(this))
    }

    return this.constructor.from(uniqby(this, item => item[key]))
  }

  shuffle() {
    return this.constructor.from(shuffle(this))
  }

  is(compareWith) {
    return isequal(this, compareWith)
  }

  squawksLike(duck) {
    return this.is(duck)
  }
}

export default Arrayable
