import { ContextProvider, HigherOrderReducer } from './models'
import { Reducer, Action, AnyAction } from 'redux'
import identity from './identity'

/**
 * It executes the * reducer* returned by `reducerCreator` and
 * assigns the result to the *input state* property with `propName`:
 *
 * * state `S` must be an object
 * * `reducerCreator` is a function that takes the property name and returns *reducer*
 * * `propName` can be a `string` or a *context provider* - a function that takes the input state and action and
 * returns the property name.
 * * if context provider returns `undefined` then input state is returned instead of executing `reducerCreator`
 */

export default <PS, S extends { [key: string]: any } = {}, A extends Action = AnyAction>(
  propName: string | ContextProvider<string | undefined, S, A>,
  reducerCreator: (prop: string) => Reducer<PS, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>): Reducer<S, A> =>
    (state: S | undefined, action: A) => {
      state = innerReducer(state, action)
      const prop = typeof propName === 'function' ? propName(state, action) : propName
      if (!prop) return state
      propName = prop
      const reducer = reducerCreator(propName)
      return Object.assign({}, state, {
        [propName]: reducer(state[propName], action)
      })
    }
