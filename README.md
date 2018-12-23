Redux-HOR 
-----
[![CircleCI](https://circleci.com/gh/pwlmaciejewski/redux-hor/tree/master.svg?style=svg)](https://circleci.com/gh/pwlmaciejewski/redux-hor/tree/master)
[![npm version](https://badge.fury.io/js/redux-hor.svg)](https://badge.fury.io/js/redux-hor)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Higher-order Redux is a utility belt for Redux that makes
heavy use of **higher-order reducers** to provide:

* Reduced boilerplate 🔩
* Increased modularity 📦
* Development speedup 🚄

Oh, btw... Higher-order reducer is a function that takes a reducer argument and returns a new reducer:

```typescript
HigherOrderReducer<State, Action> = (innerReducer: Reducer<State, Action>): Reducer<State, Action>
```


## Installation

```
yarn add redux-hor
```


## Quick start

Here's a standard reducer that we all know an love:

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
  onAction('UPDATE_AUTHOR', () => merge({ author: action.payload }))
)(init(initialState))
```

## API docs

[Read them here](./API.md)
