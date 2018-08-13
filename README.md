# redux-hor

Higher-order Reducers for Redux.


## Installation

```
yarn add redux-hor
```


## Quick start

Higher-order reducer is a function that takes a reducer as an argument and returns a new reducer:

```typescript
HigherOrderReducer<State, Action> = (innerReducer: Reducer<State, Action>): Reducer<State, Action>
```

Here's a standard reducer:

```typescript
export default function reducer (state = initialState, action) {
  if (action.type === 'UPDATE_AUTHOR') {
    return {
      ...state,
      author: action.payload
    }
  }

  return state
}
```

Compare it with HoR style:

```typescript
import { compose, withActionType, withInitialState, mergeState, identity } from 'redux-hor'

export compose(
  withActionType('UPDATE_AUTHOR', mergeState({ author: action.payload })),
  withInitialState(initialState)
)(identity)
```


## API

* [Reducers](#utilities)
  + [`identity()`](#identity)
  + [`mergeState()`](#mergestate)
* [Higher-order Reducers](#higher-order-reducers)
  + [`withInitialState()`](#withinitialstate)
  + [`withActionType()`](#withactiontype)
  + [`wrap()`](#wrap)
  + [`compose()`](#compose)

### Reducers

#### `identity()`

It's a reducer that returns the input state.

#### `mergeState()`

```js
mergeState<State, Action>(
  partialState: State
): Reducer<State, Action>
```

It creates a reducer that will merge input state with `partialState` object.

#### `withInitialState()`

```js
withInitialState<State, Action>(
  initialState: State
): HigherOrderReducer<State, Action>
```

It will set the initial state if input state is `undefined`

#### `withActionType()`

```js
withActionType<State, Action>(
  actionType: any,
  handler: Reducer<State, Action>
): HigherOrderReducer<State, Action>
```

It will execute the `handler` reducer on the state if action type is equal `actionType`.
