# stateme.js

super tiny reactive state inspired by Vue.js

### Installation

```
npm install stateme.js
```

or via CDN:

```html
<script src="https://unpkg.com/stateme.js/lib/stateme.js"></script>
```

### Usage

```javascript
import watch from 'stateme.js'

const myCounterProps = {
  enabled: true,
  count: 0,
  title: "My Pomodoro Timer"
}

// only watch the count prop
const state = watch(myCounterProps, [ 'count' ])

state.onUpdate(prop => console.log(`UPDATED { ${prop}: ${state[prop]} }`))

state.count++
// output: UPDATED { count: 1 }
```


### Documentation

#### watch

Returns an instance of stateme.js, not your original object

| Params         | Description |
| ------         | ----------- |
| originalObject   | The object you want to watch. default: `{}`                        |
| selectedProps  | **Optional**. Only watch the properties in an array. default: `[]` |

#### Methods

##### `onBeforeUpdate`

Add a callback to trigger before a value update

usage:
```javascript
state.onBeforeUpdate(prop =>
  console.log(`WILL UPDATE { ${prop}: ${state[prop]} }`)
)
```

| Params         | Description |
| ------         | ----------- |
| func           | Your callback function          .                                   |
| selectedProps  | **Optional**. Only watch the properties in an array. default: `[]` |

##### `onUpdate`

Add a callback to trigger after a value update

```javascript
state.onUpdate(prop => console.log(`UPDATED { ${prop}: ${state[prop]} }`), ['count])
```

| Params         | Description |
| ------         | ----------- |
| func           | Your callback function          .                                   |
| selectedProps  | **Optional**. Only watch the properties in an array. default: `[]` |

##### `onDestroy`

```javascript
state.onDestroy(() =>
  console.warn(`${JSON.stringify(state, null, 2)}`, 'DESTROYED')
)
```

Add a callback to trigger when you call the `destory()` method.

| Params         | Description |
| ------         | ----------- |
| func           | Your callback function          .                                   |
| selectedProps  | **Optional**. Only watch the properties in an array. default: `[]` |

##### `destroy`

Removes all the callbacks registered.
