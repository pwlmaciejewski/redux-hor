import { HigherOrderReducer, ContextProvider, HORCreator } from './models'
import { Action } from 'redux'

const withContext = <C, S, A extends Action>(
  provider: ContextProvider<C, S, A>,
  horCreator: HORCreator<C, S, A>
) => {
  // branch: if there's context then execute provider
}