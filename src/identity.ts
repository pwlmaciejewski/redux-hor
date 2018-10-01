import { Reducer, AnyAction, Action } from 'redux'

/**
 * Creates a reducer that always returns the input state without modifying it.
 * It throws if the state is undefined.
 */
function identity<S, A extends Action = AnyAction>(): Reducer<S, A> {
  return (state: S | undefined, action: A) => {
    if (typeof state === 'undefined') throw new Error('Undefined state passed to identity()')
    return state
  }
}

export default identity