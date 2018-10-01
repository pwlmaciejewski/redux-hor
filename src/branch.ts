import { Reducer, AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import passState from './passState'

export default <S, A extends Action = AnyAction>(
  test: (state: S, action: A) => boolean,
  left: HigherOrderReducer<S, A>,
  right: HigherOrderReducer<S, A> = passState<S, A>()
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    (state: S | undefined, action: A) => {
      // TODO: innerReducer is called twice on different states, probably a bug
      state = innerReducer(state, action)
      return test(state, action) ? left(innerReducer)(state, action) : right(innerReducer)(state, action)
    }