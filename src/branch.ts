import { Reducer, AnyAction, Action } from 'redux'
import { HigherOrderReducer, ContextProvider } from './models'
import passThrough from './passThrough'
import identity from './identity'

export default <S, A extends Action = AnyAction>(
  test: ContextProvider<boolean, S, A>,
  left: HigherOrderReducer<S, A>,
  right: HigherOrderReducer<S, A> = passThrough<S, A>()
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    (state: S | undefined, action: A) => {
      state = innerReducer(state, action)
      return test(state, action) ? left(identity())(state, action) : right(identity())(state, action)
    }