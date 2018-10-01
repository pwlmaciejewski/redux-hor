import { Reducer, AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'

export default <S, A extends Action = AnyAction>(
  ...args: HigherOrderReducer<S, A>[]
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    args.reduceRight(
      (reducer: Reducer<S, A>, hor: HigherOrderReducer<S, A>) => hor(reducer),
      innerReducer
    )