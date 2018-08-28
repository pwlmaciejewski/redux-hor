
import { HigherOrderReducer } from './models'
import { Reducer, AnyAction, Action } from 'redux'

export const initialState = <S, A extends Action = AnyAction>(initialState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => typeof state === 'undefined' ? initialState : state

export const identity = <S, A extends Action = AnyAction>(): Reducer<S, A> =>
  (state: S | undefined, action: A) => {
    if (typeof state === 'undefined') throw new Error('Undefined state passed to identity()')
    return state
  }

export const always = <S, A extends Action = AnyAction>(alwaysState: S): Reducer<S, A> =>
  (state: S | undefined, action: A) => alwaysState

// TODO: More general, add tests
export const composeReducers = <S, A extends Action = AnyAction>(
  outerReducer: Reducer<S, A>,
  innerReducer: Reducer<S, A>
): Reducer<S, A> =>
  (state: S, action: A) => outerReducer(innerReducer(state, action), action)

export const elevate = <S, A extends Action = AnyAction>(
  outerReducer: Reducer<S, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) => composeReducers<S, A>(outerReducer, innerReducer)

export const passState = <S, A extends Action = AnyAction>(): HigherOrderReducer<S, A> =>
  elevate<S, A>(identity<S, A>())

export const withState = <S, A extends Action = AnyAction>(newState: S): HigherOrderReducer<S, A> =>
  elevate<S, A>(always<S, A>(newState))

export const mergeState = <S, A extends Action = AnyAction>(newState: Partial<S>): HigherOrderReducer<S, A> =>
  elevate<S, A>(state => Object.assign({}, state, newState))

export const compose = <S, A extends Action = AnyAction>(
  ...args: HigherOrderReducer<S, A>[]
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    args.reduceRight(
      (reducer: Reducer<S, A>, hor: HigherOrderReducer<S, A>) => hor(reducer),
      innerReducer
    )

export const branch = <S, A extends Action = AnyAction>(
  test: (state: S, action: A) => boolean,
  left: HigherOrderReducer<S, A>,
  right: HigherOrderReducer<S, A> = passState<S, A>()
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>) =>
    (state: S | undefined, action: A) => {
      // TODO: innerReducer is called twice on differnet states, probably a bug
      state = innerReducer(state, action)
      return test(state, action) ? left(innerReducer)(state, action) : right(innerReducer)(state, action)
    }

// TODO: Change name to withAction
// TODO: Idea: replace actionType with string | testFn
// TODO:
export const withActionType = <T, S, A extends Action<T> = AnyAction>(
  actionType: T,
  actionHoR: HigherOrderReducer<S, A>
): HigherOrderReducer<S, A> =>
  // TODO: Type checking: how to make action A type narrwed down if test passed??
  branch<S, A>((state: S, action: A) => action.type === actionType, actionHoR)

// TODO: Test different return types
type PropNameFn<S, A extends Action> = (state: S, action: A) => string | undefined

// TODO: Can we make HoR out of it?? It would be very helpfun to be able to use HOR and HorCreator interchangebly
// Maybe it's some kind of compose()?
type HorCreator<S, RS, A extends Action> = (state: S | undefined, action: A) => HigherOrderReducer<RS, A>

// WIP
const withContext = <C, S, A extends Action>(
  provider: (state: S | undefined, action: A) => C | undefined,
  hocCreator: (context: C) => HigherOrderReducer<S, A>
) => {
  // branch: if there's context then execute provider
}

// TODO: Tests are obsolete
export const nest = <PS, S extends { [key: string]: any } = {}, A extends Action = AnyAction>(
  propName: string | PropNameFn<S, A>,
  horCreator: HorCreator<S, PS, A>
): HigherOrderReducer<S, A> =>
  (innerReducer: Reducer<S, A>): Reducer<S, A> =>
    (state: S | undefined, action: A) => {
      state = innerReducer(state, action)
      const prop = typeof propName === 'function' ? propName(state, action) : propName
      if (!prop) return state
      propName = prop
      const hor = horCreator(state, action)
      return Object.assign({}, state, {
        [propName]: hor(identity())(state[propName], action)
      })
    }

  // elevate<S, A>(
  //   (state: S, action: A) => {
  //     const prop = typeof propName === 'function' ? propName(state, action) : propName
  //     if (!prop) return state
  //     propName = prop
  //     const reducer = propReducer(state, action)
  //     return Object.assign({}, state, {
  //       [propName]: reducer(state[propName], action)
  //     })
  //   }
  // )

// TODO: It's most likely obsolete by nest
export const trigger = <S, A extends Action = AnyAction>(
  test: (state: S, action: A) => boolean,
  horCreator: HorCreator<S, S, A>
): HigherOrderReducer<S, A> => {
  let hor: HigherOrderReducer<S, A>
  return (innerReducer: Reducer<S, A>): Reducer<S, A> =>
    (state: S | undefined, action: A) => {
      if (hor) return hor(innerReducer)(state, action)
      state = innerReducer(state, action)
      if (!hor && test(state, action)) {
        hor = horCreator(state, action)
        return hor(identity())(state, action)
      }
      return state
    }
}
