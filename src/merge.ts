import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import elevate from './elevate'

/** 
 * Creates a higher-order reducer that merges input state and the mergeSate objects.
 */
export default <S extends { [key: string]: any }, A extends Action = AnyAction>(mergeState: Partial<S>): HigherOrderReducer<S, A> =>
  elevate<S, A>(state => Object.assign({}, state, mergeState))