import { AnyAction, Action } from 'redux'
import { HigherOrderReducer } from './models'
import branch from './branch'

export default <S, A extends Action = AnyAction>(
  actions: Action | Action[],
  actionHoR: HigherOrderReducer<S, A>
): HigherOrderReducer<S, A> =>
  branch<S, A>(
    (state: S, action: A) => {
      if (Array.isArray(actions)) {
        for (const a of actions) {
          if (a.type === action.type) return true
        }
        return false
      } 
      return actions.type === action.type
    },
    actionHoR
  )