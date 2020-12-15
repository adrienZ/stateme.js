import createHook, { exportHooks } from './hook'

function watch(originalObject = {}, selectedProps = []) {
  const instance = {}
  const _props = selectedProps.length ? selectedProps : Object.keys(instance)

  // Copy props from originalObject, will be used by getter/setter
  const _ref = _props.reduce((obj, key) => {
    obj[key] = originalObject[key]
    return obj
  }, {})

  // lifecycle
  const [$beforeUpdate, $updated, $destroy] = [
    createHook(_props),
    createHook(_props),
    createHook(_props),
  ]

  // methods
  const destroy = () => {
    _props.forEach(name => $destroy.run(name))

    $beforeUpdate.reset()
    $updated.reset()
    $destroy.reset()
  }

  const _proxy = _props.reduce((acc, key) => {
    // getter/setter point to _ref, we can add logic in setter
    acc[key] = {
      set(value) {
        $beforeUpdate.run(key)
        _ref[key] = value
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
    onBeforeUpdate,
    onUpdate,
    onDestroy,
    destroy,
  })
}

export default watch
