# API (WIP)

* [Reducers](#reducers)
  + [`identity()`](#identity)
  + [`mergeState()`](#merge)
* [Higher-order Reducers](#higher-order-reducers)
  + [`withInitialState()`](#withinitialstate)
  + [`withActionType()`](#withactiontype)
  + [`wrap()`](#wrap)
  + [`compose()`](#compose)

---

## Reducers

### `identity()`

It's a reducer that returns the input state.

### `merge()`

```js
mergeState<State, Action>(
  partialState: State
): Reducer<State, Action>
```

It creates a reducer that will merge input state with `partialState` object.

### `withInitialState()`

```js
withInitialState<State, Action>(
  initialState: State
): HigherOrderReducer<State, Action>
```

It will set the initial state if input state is `undefined`

### `withActionType()`

```js
withActionType<State, Action>(
  actionType: any,
  handler: Reducer<State, Action>
): HigherOrderReducer<State, Action>
```