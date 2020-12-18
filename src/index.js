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

  // HANDLE DOM INPUT
  function connectInput(input, props = []) {
    const inputController = inputHandler.apply({ instance, _ref }, [input])
    props.forEach(key => {
      $input.bind(inputController.set.bind(undefined, key), [key])
      input.addEventListener('input', e => inputController.get(e, key))
      input.addEventListener('change', e => inputController.get(e, key))
    })
  }

  // PROXY
  const _proxy = _props.reduce((acc, key) => {
    // getter/setter point to _ref, we can add logic in setter
    acc[key] = {
      set(value) {
        // beforeUpdate hook callbacks for the prop
        $beforeUpdate.run(key)
        // the TRVE setter
        _ref[key] = value
        // input DOM setter
        $input.run(key, value)
        // update hook callbacks for the prop
        $updated.run(key)
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
  Object.defineProperties(instance, _proxy)

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
