import { HigherOrderReducer, ContextProvider, HORCreator } from './models'
import { Action, AnyAction, Reducer } from 'redux'
import identity from './identity';

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
