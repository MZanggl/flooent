import * as pull from 'lodash.pull'
import * as uniq from 'lodash.uniq'
import * as uniqby from 'lodash.uniqby'
import * as shuffle from 'lodash.shuffle'
import * as omit from 'lodash.omit'
import * as clonedeep from 'lodash.clonedeep'
import * as isequal from 'lodash.isequal'

class Arrayable extends Array {
  first(count) {
    if (count) {
      return this.slice(0, count)
    }

    return this[0]
  }

  second() {
    return this[1]
  }
  
  last(count) {
    if (count) {
      return this.slice(this.length - count)
    }

    return this[this.length - 1]
  }

  nth(index) {
    if (index < 0) {
      index = this.length + index
    }
    return this[index]
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
      const group = typeof key === 'function' ? key(item) : item[key]
      result[group] = result[group] || new this.constructor
      result[group].push(item)
      return result
    }, {})
  }

  sum(key) {
    return this.reduce((result, item) => {
      let number = item
      if (key) {
        number = typeof key === 'function' ? key(item) : item[key]
      }
      return result + number
    }, 0)
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

    const compareFn = typeof key === 'function' ? key : item => item[key]
    return this.constructor.from(uniqby(this, compareFn))
  }

  shuffle() {
    return this.constructor.from(shuffle(this))
  }

  is(compareWith) {
    return isequal(this, compareWith)
  }

  tap(fn) {
    fn(this)
    return this
  }

  pipe(callback) {
    return this.constructor.from(callback(this))
  }

  when(comparison, then) {
    const isBoolean = typeof comparison === 'boolean'

    if (isBoolean && !comparison) {
      return this
    }

    if (!isBoolean && !comparison(this)) {
      return this
    }
    
    return this.pipe(then)
  }

  quacksLike(duck) {
    return this.is(duck)
  }

  partition(callback) {
    const tuple = [ this.constructor.from([]), this.constructor.from([]) ]

    return this.reduce((result, item) => {
      const hasPassedTest = callback(item)
      result[hasPassedTest ? 0 : 1].push(item)
      return result
    }, tuple)
  }

  prepend(...items) {
    this.unshift(...items)
    return this
  }

  append(...items) {
    this.push(...items)
    return this
  }

  sortDesc(key) {
    if (!key) {
      return this.constructor.from(this).sort().reverse()
    }
    return this.constructor.from(this).sort((a, b) => b[key] - a[key])
  }

  sortAsc(key) {
    if (!key) {
      return this.constructor.from(this).sort()
    }
    return this.constructor.from(this).sort((a, b) => a[key] - b[key])
  }

}

export default Arrayable
