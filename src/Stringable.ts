import camelcase from "lodash.camelcase";
import upperFirst from "lodash.upperfirst";
import kebabcase from "lodash.kebabcase";
import snakecase from "lodash.snakecase";
import startcase from "lodash.startcase";
import slugify from "slugify";
import pluralize from "pluralize";

const override = [
  "replace",
  "replaceAll",
  "trim",
  "trimEnd",
  "trimStart",
  "substr",
  "substring",
  "concat",
  "repeat",
  "slice",
  "toLocaleLowerCase",
  "toLocaleUpperCase",
  "toLowerCase",
  "toUpperCase",
  "charAt",
  "charCodeAt",
];

const symbol = Symbol("Stringable");

class Stringable extends String {
  ["constructor"]!: typeof Stringable;
  _symbol: typeof symbol;

  constructor(value) {
    if (
      ["string", "number", "boolean"].indexOf(typeof value) >= 0 ||
      Array.isArray(value)
    ) {
      super(value);
    } else if (!value) {
      super("");
    } else if (value instanceof String) {
      super(value.valueOf());
    } else if (typeof value === "object") {
      super(JSON.stringify(value));
    } else {
      throw new Error(typeof value + " is not an allowed type");
    }

    this._symbol = symbol;

    override.forEach((name) => {
      this[name] = (...args) => {
        return new this.constructor(super[name](...args));
      };
    });
  }

  static from(value) {
    return new this(value);
  }

  static of(value) {
    return new this(value);
  }

  after(part) {
    const index = this.indexOf(part);
    if (index === -1) {
      return this;
    }
    return (this.slice(index + part.length) as unknown) as Stringable;
  }

  afterLast(part) {
    const index = this.lastIndexOf(part);
    if (index === -1) {
      return this;
    }
    return (this.slice(index + part.length) as unknown) as Stringable;
  }

  before(part) {
    const index = this.indexOf(part);
    if (index === -1) {
      return this;
    }
    return (this.slice(0, index) as unknown) as Stringable;
  }

  beforeLast(part) {
    const index = this.lastIndexOf(part);
    if (index === -1) {
      return this;
    }
    return (this.slice(0, index) as unknown) as Stringable;
  }

  between(start) {
    return {
      and: (end) => this.after(start).before(end),
      andLast: (end) => this.after(start).beforeLast(end),
    };
  }

  betweenLast(start) {
    return {
      and: (end) => this.afterLast(start).before(end),
      andLast: (end) => this.afterLast(start).beforeLast(end),
    };
  }

  when(comparison, then) {
    const isBoolean = typeof comparison === "boolean";

    if (isBoolean && !comparison) {
      return this;
    }

    if (!isBoolean && !comparison(this)) {
      return this;
    }

    return (this.pipe(then) as unknown) as Stringable;
  }

  whenEmpty(then) {
    return this.when(this.is(""), then);
  }

  pipe(callback) {
    const result = callback(this);
    return result._symbol === symbol
      ? result
      : ((new this.constructor(result) as unknown) as Stringable);
  }

  wrap(start, end = start) {
    return (this.prepend(start).append(end) as unknown) as Stringable;
  }

  unwrap(start, end = start) {
    return this.when(this.startsWith(start), (str) =>
      str.substring(start.length)
    ).when(this.endsWith(end), (str) =>
      str.substring(0, str.length - end.length)
    );
  }

  append(part) {
    return (this.concat(part) as unknown) as Stringable;
  }

  prepend(part) {
    return new this.constructor(part + this);
  }

  is(compare) {
    return this.valueOf() === compare;
  }

  includedIn(array) {
    return (array.includes(this.valueOf()) as unknown) as Stringable;
  }

  endWith(part) {
    if (this.endsWith(part)) {
      return this;
    } else {
      return this.append(part);
    }
  }

  startWith(part) {
    if (this.startsWith(part)) {
      return this;
    } else {
      return this.prepend(part);
    }
  }

  limit(n, append = "...") {
    const raw = this.valueOf();
    let truncated = raw.slice(0, n);
    if (append && raw.length > n) {
      truncated += append;
    }
    return new this.constructor(truncated);
  }

  camel() {
    return new this.constructor(camelcase((this as unknown) as string));
  }

  snake() {
    return new this.constructor(snakecase((this as unknown) as string));
  }

  kebab() {
    return new this.constructor(kebabcase((this as unknown) as string));
  }

  title() {
    return new this.constructor(startcase((this as unknown) as string));
  }

  capitalize() {
    return new this.constructor(upperFirst((this as unknown) as string));
  }

  studly() {
    return this.camel().capitalize();
  }

  slug(replacement = "-") {
    const value = this.valueOf()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "");
    return new this.constructor(
      slugify(value, {
        replacement,
        lower: true,
        strict: true,
      })
    );
  }

  tap(fn): Stringable {
    fn(this);
    return this;
  }

  parse() {
    return JSON.parse(this as any);
  }

  plural(count) {
    return new this.constructor(pluralize(this, count, false));
  }

  singular() {
    return new this.constructor(pluralize.singular(this));
  }
}

export default Stringable;
