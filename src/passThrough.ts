import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import elevate from './elevate'
import identity from './identity'

/**
 * Creates a *higher-order reducer* that returns the inner state without modifying it.
 * It's a higher-order equivalent of `indentity()`.
 */
export default <S, A extends Action = AnyAction>(): HigherOrderReducer<S, A> =>
  elevate<S, A>(identity<S, A>())