import { ContextProvider, HORCreator, HigherOrderReducer } from './models'
import { Reducer, Action, AnyAction } from 'redux'
import identity from './identity'

export default <PS, S extends { [key: string]: any } = {}, A extends Action = AnyAction>(
  propName: string | ContextProvider<string | undefined, S, A>,
  horCreator: HORCreator<string, PS, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>): Reducer<S, A> =>
    (state: S | undefined, action: A) => {
      state = innerReducer(state, action)
      const prop = typeof propName === 'function' ? propName(state, action) : propName
      if (!prop) return state
      propName = prop
      const hor = horCreator(propName)
      return Object.assign({}, state, {
        [propName]: hor(identity())(state[propName], action)
      })
    }