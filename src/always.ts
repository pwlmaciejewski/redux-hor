import { Reducer, AnyAction, Action } from 'redux'

/**
 * Creates a reducer that returns always the same, predefined state. 
 * Ignores the input state and action.
 */
export default <S, A extends Action = AnyAction>(alwaysState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => alwaysState