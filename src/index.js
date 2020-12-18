import createHook, { exportHooks, destroyHooks } from './hook'
import inputHandler from './dom'

function watch(originalObject = {}, selectedProps = []) {
  // the object that will be returned
  const instance = {}

  // props to watch
  const _props = selectedProps.length
    ? selectedProps
    : Object.keys(originalObject)

  // Copy props from originalObject, will be used by getter/setter
  const _ref = _props.reduce((obj, key) => {
    obj[key] = originalObject[key]
    return obj
  }, {})

  // lifecycle, prefixed by $
  const [$beforeUpdate, $updated, $destroy, $input] = [
    createHook(_props),
    createHook(_props),
    createHook(_props),
    createHook(_props),
  ]

  // METHODS

  // stop hooks, but get keep get/set
  const destroy = () => {
    _props.forEach(name => $destroy.run(name))
    destroyHooks($beforeUpdate, $updated, $destroy)
  }

  // core setter
  function onSet(key, value) {
    // beforeUpdate hook callbacks for the prop
    $beforeUpdate.run(key)
    // the TRVE setter
    _ref[key] = value
    // input DOM setter
    $input.run(key, value)
    // update hook callbacks for the prop
    $updated.run(key)
  }

  // HANDLE DOM INPUT
  function connectInput(input, props = []) {
    // create input controller and send data from the instance
    const inputController = inputHandler.apply({ _ref, onSet }, [input])
    props.forEach(key => {
      // the $input hook run during onSet() to update the view (input)
      $input.bind(inputController.set.bind(undefined, key), [key])

      // DOM events
      const catchValue = e => {
        inputController.onEvent(e, key)
      }

      input.addEventListener('input', catchValue)
      input.addEventListener('change', catchValue)
    })
  }

  // PROXY
  const _proxy = _props.reduce((acc, key) => {
    // getter/setter point to _ref, we can add logic in setter
    acc[key] = {
      set(value) {
        onSet(key, value)
      },

      get() {
        return _ref[key]
      },
    }
    return acc
  }, {})

  // DX: debug helper
  _proxy['props'] = {
    value: _props,
    enumerable: true,
  }

  // apply getters/setters
  Object.defineProperties(instance, _proxy, onSet)

  // public api
  const [onBeforeUpdate, onUpdate, onDestroy] = exportHooks(
    $beforeUpdate,
    $updated,
    $destroy
  )

  // export
  return Object.assign(instance, {
    connectInput,
    onBeforeUpdate,
    onUpdate,
    onDestroy,
    destroy,
  })
}

export default watch
