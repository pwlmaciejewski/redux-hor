import { Reducer, AnyAction, Action } from 'redux'

/**
 * Creates a reducer that always returns the initialState if the input state is undefined.
 */
export default <S, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => 
    typeof state === 'undefined' ? initialState : state