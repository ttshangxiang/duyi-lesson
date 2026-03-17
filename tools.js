function flatten(arr, depth = Infinity) {
  if (depth <= 0) {
    return arr
  }

  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...flatten(item, depth - 1))
    } else {
      result.push(item)
    }
    return result
  }, [])
}

function myCall(context, ...args) {
  if (context === null || context === undefined) {
    context = globalThis
  }
  if (typeof context !== "object") {
    context = Object(context)
  }

  const fn = this
  context._fn = fn
  const result = context._fn(...args)
  delete context._fn
  return result
}

function myApply(context, args = []) {
  if (context === null || context === undefined) {
    context = globalThis
  }
  if (typeof context !== "object") {
    context = Object(context)
  }

  const fn = this
  context._fn = fn
  const result = context._fn(...args)
  delete context._fn
  return result
}

function myBind(context, ...args) {
  if (context === null || context === undefined) {
    context = globalThis
  }
  if (typeof context !== "object") {
    context = Object(context)
  }

  const fn = this
  return function (...args2) {
    return fn.apply(this instanceof boundFn ? this : context, [
      ...args,
      ...args2,
    ])
  }

  function boundFn() {}
}

class MyPromise {
  constructor(executor) {
    this.state = "pending"
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state !== "pending") return
      if (value instanceof MyPromise) {
        value.then(resolve, reject)
        return
      }
      this.state = "fulfilled"
      this.value = value
      this.onFulfilledCallbacks.forEach((cb) => cb())
    }

    const reject = (reason) => {
      if (this.state !== "pending") return
      this.state = "rejected"
      this.value = reason
      this.onRejectedCallbacks.forEach((cb) => cb())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        try {
          const result =
            this.state === "fulfilled"
              ? onFulfilled?.(this.value)
              : onRejected?.(this.value)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      if (this.state === "pending") {
        this.onFulfilledCallbacks.push(handle)
        this.onRejectedCallbacks.push(handle)
      } else {
        setTimeout(handle, 0)
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.()
        return value
      },
      (reason) => {
        onFinally?.()
        throw reason
      },
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }
}

MyPromise.all = function (promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("promises must be an array"))
    }

    const results = []
    let count = 0

    if (promises.length === 0) {
      return resolve(results)
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (value) => {
          results[index] = value
          count++
          if (count === promises.length) {
            resolve(results)
          }
        },
        (reason) => {
          reject(reason)
        },
      )
    })
  })
}
