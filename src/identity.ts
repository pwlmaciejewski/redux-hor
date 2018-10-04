import { Reducer, AnyAction, Action } from 'redux'

/**
 * It's a reducer that returns the *input state* without modyfying it.
 * It throws an error if *input state* is `undefined`.
 */
function identity<S, A extends Action = AnyAction>(): Reducer<S, A> {
  return (state: S | undefined, action: A) => {
    if (typeof state === 'undefined') throw new Error('Undefined state passed to identity()')
    return state
  }
}

export default identity