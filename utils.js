export const isFunction = f => {
  if (typeof f !== 'function') throw new TypeError(f + ' is not a function')
  return true
}
