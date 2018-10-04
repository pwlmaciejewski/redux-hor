import { HigherOrderReducer, ContextProvider, HORCreator } from './models'
import { Action, AnyAction, Reducer } from 'redux'
import identity from './identity';

/**
 * `Provider` is a function that takes *input state* and *action* and returns *context* that will be passed
  * to the `horCreator`. *Higher-order reducer* returned from the creator is executed to get the *output state*.
 * If `provider` returned `undefined` then `horCreator` execution is skipped and the input state is returned instead.
 */

export default <C, S, A extends Action = AnyAction>(
  provider: ContextProvider<C | undefined, S, A>,
  horCreator: HORCreator<C, S, A>
): HigherOrderReducer<S, A> => 
  (innerReducer: Reducer<S, A>): Reducer<S, A> =>
    (state: S | undefined, action: A) => {
      state = innerReducer(state, action)
      const context = provider(state, action)
      if (typeof context === 'undefined') return state
      const hor = horCreator(context)
      return hor(identity())(state, action)
    }
