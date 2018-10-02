import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import branch from './branch'

export default <T, S, A extends Action<T> = AnyAction>(
  actionType: T,
  actionHoR: HigherOrderReducer<S, A>
): HigherOrderReducer<S, A> =>
  // TODO: Type checking: how to make action A type narrwed down if test passed??
  branch<S, A>((state: S, action: A) => action.type === actionType, actionHoR)