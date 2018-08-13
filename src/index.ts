
import { HigherOrderReducer, StatefulReducer } from './models'
import { Reducer, AnyAction, Action } from 'redux'

export const initialState = <S = any, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => typeof state === 'undefined' ? initialState : state

export const mergeState = <S = any, A extends Action = AnyAction>(newState: Partial<S>): StatefulReducer<S, A> =>
  (state: S, action: A) => Object.assign({}, state, newState)

export const wrap = <S = any, A extends Action = AnyAction>(outerReducer: Reducer<S, A>): HigherOrderReducer<S, A> =>
  (innerReducer: StatefulReducer<S, A>) =>
    (state: S, action: A) => outerReducer(innerReducer(state, action), action)

export const withActionType = <T, S = any, A extends Action<T> = AnyAction>(actionType: T, handler: Reducer<S, A>) =>
  wrap<S, A>((state: S, action: A) => action.type === actionType ? handler(state, action) : state)
