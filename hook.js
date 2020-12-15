import { isFunction } from './utils'

const createHook = (keys = []) => {
  function resetHook() {
    return keys.reduce((acc, key) => {
      acc[key] = []
      return acc
    }, {})
  }

  let store = resetHook()

  return {
    reset: () => (store = resetHook()),
    bind(func, selectedProps = []) {
      if (!isFunction(func)) {
        throw new TypeError('the first argument is not a function')
      }

      const targets = selectedProps.length ? selectedProps : keys

      targets.forEach(prop => {
        store[prop].push(func)
      })
    },
    run(prop) {
      const callbacks = store[prop]

      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](prop)
      }
    },
  }
}

export default createHook

export function exportHooks() {
  return [...arguments].map(hook => hook.bind)
}

export function destroy() {
  return [...arguments].map(hook => hook.reset())
}
