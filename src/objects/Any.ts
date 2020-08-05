class Any<T> {
  constructor(private value: T) {}

  /**
   * Executes and returns the result of a callback.
   * This is useful for grouping common logic together and avoiding temporary variables. 
   */
  do<R>(callback: ((value: T) => R)) {
    return callback(this.value)
  }
}

export default Any