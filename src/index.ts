
import { HigherOrderReducer } from './models'
import { Reducer, AnyAction, Action } from 'redux'

export const initialState = <S = any, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => typeof state === 'undefined' ? initialState : state

export const identity = <S = any, A extends Action = AnyAction>(): Reducer<S, A> =>
  (state: S | undefined, action: A) => {
    if (typeof state === 'undefined') throw new Error('Undefined state passed to identity()')
    return state
  }

export const always = <S = any, A extends Action = AnyAction>(alwaysState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => alwaysState

// TODO: More generic, add tests
export const composeReducers = <S = any, A extends Action = AnyAction>(
  outerReducer: Reducer<S, A>,
  innerReducer: Reducer<S, A>
): Reducer<S, A> =>
  (state: S, action: A) => outerReducer(innerReducer(state, action), action)

export const elevate = <S = any, A extends Action = AnyAction>(
  outerReducer: Reducer<S, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) => composeReducers<S, A>(outerReducer, innerReducer)

export const passState = <S = any, A extends Action = AnyAction>(): HigherOrderReducer<S, A> =>
  elevate<S, A>(identity<S, A>())

export const withState = <S = any, A extends Action = AnyAction>(newState: S): HigherOrderReducer<S, A> =>
  elevate<S, A>(always<S, A>(newState))

export const mergeState = <S = any, A extends Action = AnyAction>(newState: Partial<S>): HigherOrderReducer<S, A> =>
  elevate<S, A>(state => Object.assign({}, state, newState))

export const compose = <S = any, A extends Action = AnyAction>(
  ...args: HigherOrderReducer<S, A>[]
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    args.reduceRight(
      (reducer: Reducer<S, A>, hor: HigherOrderReducer<S, A>) => hor(reducer),
      innerReducer
    )

export const branch = <S = any, A extends Action = AnyAction>(
  test: (state: S, action: A) => boolean,
  left: HigherOrderReducer<S, A>,
  right: HigherOrderReducer<S, A> = passState<S, A>()
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    (state: S, action: A) => {
      state = innerReducer(state, action)
      return test(state, action) ? left(innerReducer)(state, action) : right(innerReducer)(state, action)
    }

export const withActionType = <T, S = any, A extends Action<T> = AnyAction>(
  actionType: T,
  actionHoR: HigherOrderReducer<S, A>
): HigherOrderReducer<S, A> =>
  branch<S, A>((state: S, action: A) => action.type === actionType, actionHoR)

export const nest = <PS, S extends { [key: string]: any } = {}, A extends Action = AnyAction>(
  propName: string,
  propReducer: Reducer<PS, A>
): HigherOrderReducer<S, A> =>
  elevate<S, A>(
    (state: S, action: A) =>
      Object.assign({}, state, {
        [propName]: propReducer(state[propName], action)
      })
  )
