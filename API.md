# API

* [Entities](#entities)
  * [`HigherOrderReducer<S, A>`](#higherorderreducer)
  * [`ContextProvider<C, S, A>`](#contextprovider)
  * [`HORCreator<C, S, A>`](#horcreator)
* [Reducers](#reducers)
  + [`identity()`](#identity)
  + [`init()`](#init)
  + [`always()`](#always)
  + [`pipe()`](#pipe)
* [Higher-order Reducers](#higher-order-reducers)
  + [`elevate()`](#elevate)
  + [`passThrough()`](#passthrough)
  + [`withState()`](#withstate)
  + [`merge()`](#merge)
  + [`branch()`](#branch)
  + [`onAction()`](#onaction)
  + [`nest()`](#nest)
  + [`withContext()`](#withcontext)
  + [`compose()`](#compose)

## Models

### `HigherOrderReducer`

```typescript
type HigherOrderReducer<S, A extends Action = AnyAction> = (reducer: Reducer<S, A>) => Reducer<S, A>
```

### `ContextProvider`

```typescript
type ContextProvider<C, S, A extends Action> = (state: S, action: A) => C
```

### `HORCreator`

```typescript
type HORCreator<C, S, A extends Action> = (context: C) => HigherOrderReducer<S, A>
```

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

Creates a reducer that returns always the same, predefined state.
Ignores the *input state* and *action*.

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

Joins two reducers: the output state of the *inner reducer*
is passed as an input state of the *outer reducer*.

#### Examples

```typescript
const innerReducer = (state: any = {}, action: Action) => { ...state, foo: 'bar' }
const outerReducer = (state: any = {}, action: Action) => { ...state, baz: 'qux' }
const reducer = pipe(innerReducer, outerReducer)
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar', baz: 'qux' }
```

---

## Higher-order Reducers

### `elevate()`

#### Params

* `reducer: Reducer<S, A>`

#### Description

Elevates the *reducer* to a higher-order reducer.

#### Example

```typescript
const innerReducer = (state: any = {}, action: Action) => { ...state, baz: 'qux' }
const hor = elevate(innerReducer)
const reducer = hor(init({ foo: 'bar' }))
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar', baz: 'qux' }
```

---

### `passThrough()`

#### Description

Creates a *higher-order reducer* that returns the inner state without modifying it.
It's a higher-order equivalent of `indentity()`.

#### Example

```typescript
const hor = passThrough()
const reducer = hor(init({ foo: 'bar' }))
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar' }
```

---

### `withState()`

#### Params

* `newState: any`

#### Description

Creates a *higher-order* reducer that always returns the same state.
It's a higher-order equivalent of `always()`.

#### Example

```typescript
const hor = withState(2)
const reducer = hor(always(1))
reducer(undefined, { type: 'MY_ACTION' })  // 2
```

---

### `merge()`

#### Params

* `mergeState: Partial<S>`

#### Description

Creates a *higher-order reducer* that merges *input state* and the `mergeState` objects.
State `S` must be an object.

#### Example

```typescript
const hor = merge({ baz: 'qux' })
const reducer = hor(init({ foo: 'bar' }))
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar', baz: 'qux' }
```

---

### `branch()`

#### Params

* `test: ContextProvider<boolean, S, A>`
* `left: HigherOrderReducer<S, A>`
* `right: HigherOrderReducer<S, A> = passThrough<S, A>()`

#### Description

It executes the `test`. If the result is `true` then it executes `left` branch hor.
Otherwise it executes `right` branch hor.

#### Example

```typescript
const hor = branch(
  state => state < 2,
  elevate(state => state + 1),
  withState(0)
)
const reducer = hor(init(0))
const myAction = { type: 'MY_ACTION' }
let state = reducer(undefined, myAction)  // 1
state = reducer(state, myAction)  // 2
state = reducer(state, myAction)  // 0
```

---

### `onAction()`

#### Params

* `horAction: string | string[] | A | A[]`
* `horCreator: HORCreator<A, S, A>`

#### Description

It check if the *input action* matches `horAction` and executes the `horCreator` if it does.
Matched action will be passed as an argument to the `horCreator`.

#### Example

```typescript
const myAction = { type: 'MY_ACTION' }
const otherAction = { type: 'OTHER_ACION' }
const hor = onAction(myAction, () => elevate(state => state + 1))
const reducer = hor(init(0))
let state = reducer(undefined, myAction)  // 1
state = reducer(state, myAction)  // 2
state = reducer(state, otherAction)  // 2
```

---

### `nest()`

#### Params

* `propName: string | ContextProvider<string | undefined, S, A>`
* `reducerCreator: (prop: string) => Reducer<PS, A>`

#### Description

 It executes the *reducer* returned by `reducerCreator` and
 assigns the result to the *input state* property with `propName`:

  * state `S` must be an object
  * `reducerCreator` is a function that takes the property name and returns *reducer*
  * `propName` can be a `string` or a *context provider* - a function that takes the input state and action and
  returns the property name.
  * if context provider returns `undefined` then input state is returned instead of executing `reducerCreator`

#### Example

```typescript
const myAction = { type: 'MY_ACTION' }
const hor = nest(
  'foo',
  elevate(state => state + 1)(init(0))
)
const reducer = hor(init({}))
let state = reducer(undefined, myAction)  // { foo: 1 }
state = reducer(state, myAction)  // { foo: 2 }
```

---

### `withContext()`

#### Params

* `provider: ContextProvider<C | undefined, S, A>`
* `horCreator: HORCreator<C, S, A>`

#### Description

`Provider` is a function that takes *input state* and *action* and returns *context* that will be passed
to the `horCreator`. *Higher-order reducer* returned from the creator is executed to get the *output state*.
If `provider` returned `undefined` then `horCreator` execution is skipped and the input state is returned instead.

#### Example

```typescript
const myAction = {
  type: 'MY_ACTION',
  counter: 1
}
const hor = withContext(
  (state, action) => action.counter,
  counter => withState({ foo: counter })
)
const reducer = hor(init({}))
reducer(undefined, myAction)  // { foo: 1 }
```

---

### `compose()`

#### Params

* `...args: HigherOrderReducer<S, A>[]`

#### Description

It returns a *higher-order reducer* that is a composition (from right to left) of the input *higher-order reducers*.

#### Example

```typescript
const hor = compose(
  merge({ foo: 'bar' }),
  merge({ baz: 'qux' })
)
const reducer = hor(init({}))
reducer(undefined, { type: 'MY_ACTION' })  // { foo: 'bar', baz: 'qux' }
```
