import * as camelcase from 'lodash.camelcase'
import * as upperFirst from 'lodash.upperfirst'
import * as kebabcase from 'lodash.kebabcase'
import * as snakecase from 'lodash.snakecase'
import * as startcase from 'lodash.startcase'
import * as slugify from 'slugify'
import * as pluralize from 'pluralize'

const override = ['replace', 'replaceAll', 'trim', 'trimEnd', 'trimStart', 'substr', 'substring', 'concat', 'repeat', 'slice', 'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'charAt', 'charCodeAt']

const symbol = Symbol('Stringable')

class Stringable extends String {
  constructor(value) {
    if (['string', 'number', 'boolean'].includes(typeof value) || Array.isArray(value)) {
      super(value)
    } else if (!value) {
      super('')
    } else if (value instanceof String) {
      super(value.valueOf())
    } else if (typeof value === 'object') {
      super(JSON.stringify(value))
    } else {
      throw new Error(typeof value + ' is not an allowed type')
    }

    this._symbol = symbol
    
    override.forEach(name => {
      this[name] = (...args) => {
        return new this.constructor(super[name](...args))
      }
    })
  }

  static from(value) {
    return new this(value)
  }

  static of(value) {
    return new this(value)
  }

  after(part) {
    const index = this.indexOf(part)
    if (index === -1) {
      return this
    }
    return this.slice(index + part.length)
  }

  afterLast(part) {
    const index = this.lastIndexOf(part)
    if (index === -1) {
      return this
    }
    return this.slice(index + part.length)
  }

  before(part) {
    const index = this.indexOf(part)
    if (index === -1) {
      return this
    }
    return this.slice(0, index)
  }

  beforeLast(part) {
    const index = this.lastIndexOf(part)
    if (index === -1) {
      return this
    }
    return this.slice(0, index)
  }

  between(start) {
    return {
      and: end => this.after(start).before(end),
      andLast: end => this.after(start).beforeLast(end),
    }
  }

  betweenLast(start) {
    return {
      and: end => this.afterLast(start).before(end),
      andLast: end => this.afterLast(start).beforeLast(end),
    }
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

  whenEmpty(then) {
    return this.when(this.is(''), then)
  }
  
  pipe(callback) {
    const result = callback(this)
    return result._symbol === symbol ? result : new this.constructor(result)
  }

  wrap(start, end = start) {
    return this.prepend(start).append(end)
  }

  unwrap(start, end = start) {
    return this
      .when(this.startsWith(start), str => str.substring(start.length))
      .when(this.endsWith(end), str => str.substring(0, str.length - end.length))
  }
  
  append(part) {
    return this.concat(part)
  }
  
  prepend(part) {
    return new this.constructor(part + this)
  }
  
  is(compare) {
    return this.valueOf() === compare 
  }
  
  endWith(part) {
    if (this.endsWith(part)) {
      return this
    } else {
      return this.append(part)
    }
  }
  
  startWith(part) {
    if (this.startsWith(part)) {
      return this
    } else {
      return this.prepend(part)
    }
  }
  
  limit(n, append = '...') {
    const raw = this.valueOf()
    let truncated = raw.slice(0, n)
    if (append && raw.length > n) {
      truncated += append
    }
    return new this.constructor(truncated)
  }
  
  camel() {
    return new this.constructor(camelcase(this))
  }
  
  snake() {
    return new this.constructor(snakecase(this))
  }
  
  kebab() {
    return new this.constructor(kebabcase(this))
  }
  
  title() {
    return new this.constructor(startcase(this))
  }
  
  capitalize() {
    return new this.constructor(upperFirst(this))
  }

  studly() {
    return this.camel().capitalize()
  }
  
  slug(replacement = '-') {
    const value = this.valueOf().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g,'')
    return new this.constructor(slugify(value, {
      replacement,
      lower: true,
      strict: true,
    }))
  }
  
  tap(fn) {
    fn(this)
    return this
  }

  parse() {
    return JSON.parse(this)
  }

  plural(count) {
    return new this.constructor(pluralize(this, count, false))
  }

  singular() {
    return new this.constructor(pluralize.singular(this))
  }
}

export default Stringable;
