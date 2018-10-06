import { AnyAction, Action, Reducer } from 'redux'

export type HigherOrderReducer<S, A extends Action = AnyAction> = (reducer: Reducer<S, A>) => Reducer<S, A>

export type ContextProvider<C, S, A extends Action> = (state: S, action: A) => C

export type HORCreator<C, S, A extends Action> = (context: C) => HigherOrderReducer<S, A>
