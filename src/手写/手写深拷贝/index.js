function deepCopy(value, cache = new Map()) {
  if (value === null || typeof value !== "object") {
    return value
  }

  if (cache.has(value)) {
    return cache.get(value)
  }

  if (value instanceof Date) {
    return new Date(value)
  }

  if (value instanceof RegExp) {
    return new RegExp(value)
  }

  if (value instanceof Set) {
    return new Set(value)
  }

  if (value instanceof Map) {
    return new Map(value)
  }

  const result = Array.isArray(value) ? [] : {}
  cache.set(value, result)

  const keys = [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepCopy(value[key], cache)
    }
  }

  return result
}
