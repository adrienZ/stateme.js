import { isDOM } from './utils'

function inputHandler(originalObject) {
  if (!isDOM(originalObject)) return false

  // determine the object is a DOM input
  const type = Object.getPrototypeOf(originalObject)
    .toString()
    .replace('[object ', '')
    .slice(0, -1)

  // acess to input setter
  const descriptor = Object.getOwnPropertyDescriptor(
    window[type].prototype,
    'value'
  )

  // getter
  const get = (e, key) => {
    const input = e.target
    let value = input.value

    switch (input.type) {
      case 'select-multiple':
        value = [...input.selectedOptions].map(s => s.value)
        break
      case 'checkbox':
        value = input.checked
        break
    }

    this.instance[key] = value
  }

  // setter
  const set = key => {
    const input = originalObject
    const { _ref } = this

    switch (input.type) {
      // select-multiple cannot be programmatically set with multiple values
      case 'select-multiple':
        Array.from(input.options).forEach(option => {
          // turn instance values into string to match DOM values
          if (_ref[key].map(value => value + '').includes(option.value)) {
            // set via dom
            option.selected = true
          }
        })
        break
      // file cannot be programmatically set
      case 'file':
        break
      // image use src attribute
      case 'image':
        input.src = _ref[key]
        break
      // checkbox use checked attribute
      case 'checkbox':
        input.checked = _ref[key]
        break
      // radio are a special case...
      case 'radio':
        const root = input.form || document

        // select value + name if possible, fallback to argument input
        const target = input.name
          ? root.querySelector(
              `input[type="${input.type}"][name="${input.name}"][value="${_ref[key]}"]`
            )
          : input

        // radio use checked attribute
        if (target) target.checked = true
        break
      // programmatically set by default
      default:
        descriptor.set.call(input, _ref[key]), [key]
        break
    }
  }

  return {
    descriptor,
    get,
    set,
  }
}

export default inputHandler
