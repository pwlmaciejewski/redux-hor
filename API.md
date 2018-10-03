# API (WIP)

* [Reducers](#reducers)
  + [`identity()`](#identity)
  + [`init()`](#init)
  + [`always()`](#always)
  + [`pipe()`](#pipe)
* [Higher-order Reducers](#higher-order-reducers)

## Reducers

### `identity()`

#### Description

It's a reducer that returns the *input state* without modyfying it.
It throws an error if *input state* is `undefined`.

#### Example 

```typescript
const myReducer = identity()
const myAction = { type: 'MY_ACTION' }
myReducer(1, myAction)  // 1
myReducer({ foo: 'bar' }, myAction)  // { foo: 'bar' }
myReducer(undefined, myAction)  // ERROR
```

---

### `init()`

#### Params

* `initialState: any`


#### Description

It will return the `initialState` if the *input state* is `undefined`.
Otherwise it will return the *input state*.

#### Example

```typescript
const myReducer = init(1)
const myAction = { type: 'MY_ACTION' }
myReducer(undefined, myAction)  // 1
myReducer(2, myAction)  // 2
```

---

### `always()`

#### Params

* `state: any` - state to always return from the reducer

#### Description

It always returns the same state, ignoring the *input state*.

#### Example

```typescript
const state = { foo: 'bar' }
const myReducer = always(state)
const myAction = { type: 'MY_ACTION' }
myReducer(1, myAction)  // { foo: 'bar' }
```

---

### `pipe()`

#### Params

* `innerReducer: Reducer<S, A>`
* `outerReducer: Reducer<S, A>`

#### Description

It joins two reducers: output state of one reducer is the input state of the sceond.

#### Examples

```typescript
const innerReducer = (state: any = {}, action: Action) => { ...state, foo: 'bar' }
const outerReducer = (state: any = {}, action: Action) => { ...state, baz: 'qux' }
const reducer = pipe(innerReducer, outerReducer)
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar', baz: 'qux' }
```

---

## Higher-order Reducers

TBA