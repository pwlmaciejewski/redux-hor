import { ContextProvider, HORCreator, HigherOrderReducer } from './models'
import { Reducer, Action, AnyAction } from 'redux'
import identity from './identity'

/**
 * It executes the *higher-order reducer* returned by `horCreator` and
 * assigns the result to the *input state* property with `propName`:
 *
 * * state `S` must be an object
 * * `horCreator` is a function that takes the property name and return *higher-order reducer*
 * * `propName` can be a `string` or a *context provider* - a function that takes the input state and action and
 * returns the property name.
 * * if context provider returns `undefined` then input state is returned instead of executing `horCreator`
 */

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
