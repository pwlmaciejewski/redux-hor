import { AnyAction, Action, Reducer } from 'redux'

<<<<<<< HEAD
export type HigherOrderReducer<S, A extends Action = AnyAction> = (reducer: Reducer<S, A>) => Reducer<S, A>
=======
export type HigherOrderReducer<S = any, A extends Action = AnyAction> = (reducer: Reducer<S, A>) => Reducer<S, A>
>>>>>>> 2a68084b220706262d27d1395f93762ee3bd30a6
