export const isFunction = f => {
  if (typeof f !== 'function') throw new TypeError(f + ' is not a function')
  return true
}

export const isDOM = element => {
  return element instanceof Element || element instanceof HTMLDocument
}
