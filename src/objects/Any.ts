class Any<T> {
  constructor(private value: T) {}

  do<R>(callback: ((value: T) => R)) {
    return callback(this.value)
  }
}

export default Any