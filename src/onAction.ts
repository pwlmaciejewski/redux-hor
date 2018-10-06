import { AnyAction, Action } from 'redux'
import { HigherOrderReducer, HORCreator } from './models'
import withContext from './withContext'

/**
 * It check if the *input action* matches `horAction` and executes the `horCreator` if it does.
 * Matched action will be passed as an argument to the `horCreator`.
 */

export default <S, A extends Action = AnyAction>(
  horAction: string | A | A[],
  horCreator: HORCreator<A, S, A>
): HigherOrderReducer<S, A> =>
  withContext<A, S, A>(
    (state: S, action: A) => {
      if (typeof horAction === 'string') {
        return action.type === horAction ? action : undefined  
      } else if (!Array.isArray(horAction)) {
        return action.type === horAction.type ? action : undefined
      } else {
        for (const a of horAction) {
          if (a.type === action.type) return a
        }
      }
      return
    },
    horCreator
  )