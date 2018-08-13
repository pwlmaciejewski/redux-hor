import { AnyAction, Action } from 'redux'

export type StatefulReducer<S = any, A extends Action = AnyAction> = (state: S, action: A) => S

export type HigherOrderReducer<S = any, A extends Action = AnyAction> = (reducer: StatefulReducer<S, A>) => StatefulReducer<S, A>
