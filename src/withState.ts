import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import elevate from './elevate'
import always from './always'

/** 
 * Creates a higher-order reducer that always returns the same state.
 */
export default <S, A extends Action = AnyAction>(newState: S): HigherOrderReducer<S, A> =>
  elevate<S, A>(always<S, A>(newState))