import { Reducer, AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'

/**
 * It returns a *higher-order reducer* that is a composition (from right to left) of the input *higher-order reducers*.
 */

export default <S, A extends Action = AnyAction>(
  ...args: HigherOrderReducer<S, A>[]
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    args.reduceRight(
      (reducer: Reducer<S, A>, hor: HigherOrderReducer<S, A>) => hor(reducer),
      innerReducer
    )