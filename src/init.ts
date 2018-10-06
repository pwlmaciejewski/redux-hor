import { Reducer, AnyAction, Action } from 'redux'

/**
 * It will return the `initialState` if the *input state* is `undefined`.
 * Otherwise it will return the *input state*.
 */
export default <S, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) =>
    typeof state === 'undefined' ? initialState : state
