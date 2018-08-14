import { AnyAction, Action, Reducer } from 'redux'

export type HigherOrderReducer<S = any, A extends Action = AnyAction> = (reducer: Reducer<S, A>) => Reducer<S, A>
