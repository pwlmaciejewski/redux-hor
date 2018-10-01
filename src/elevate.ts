import { Reducer, AnyAction, Action } from 'redux'
import pipe from './pipe'
import { HigherOrderReducer } from './models'

/**
 * Elevates the reducer to a higher-order reducer.
 */
export default <S, A extends Action = AnyAction>(
  reducer: Reducer<S, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) => pipe<S, A>(innerReducer, reducer)