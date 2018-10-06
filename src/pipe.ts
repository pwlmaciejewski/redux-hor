import { Reducer, AnyAction, Action } from 'redux'

/**
 * Joins two reducers: the output state of the *inner reducer*
 * is passed as an input state of the *outer reducer*.
 */
export default <S, A extends Action = AnyAction>(
  innerReducer: Reducer<S, A>,
  outerReducer: Reducer<S, A>
): Reducer<S, A> =>
  (state: S, action: A) => outerReducer(innerReducer(state, action), action)
