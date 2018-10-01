import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import elevate from './elevate'
import identity from './identity'

/**
 * Creates a higher-order reducer that returns the inner state without modifying it.
 */
export default <S, A extends Action = AnyAction>(): HigherOrderReducer<S, A> =>
  elevate<S, A>(identity<S, A>())