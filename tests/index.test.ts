import 'jest'
import { initialState, mergeState, compose, branch, passState, withState, withActionType, nest, always, elevate, identity, trigger } from '../src'
import * as sinon from 'sinon'

describe('initialState', () => {
  type State = {
    foo: string
  }

  it('should set initial state when state is undefined', () => {
    const reducer = initialState<State>({ foo: 'bar' })
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toEqual({ foo: 'bar' })
  })

  it('should pass state is it is not undefined', () => {
    const reducer = initialState<State>({ foo: 'bar' })
    const newState = reducer({ foo: 'xxx' }, { type: 'FOO' })
    expect(newState).toEqual({ foo: 'xxx' })
  })
})

describe('passState', () => {
  it('should pass falsy state', () => {
    const reducer = passState<boolean>()(initialState(false))
    expect(reducer(undefined, { type: 'FOO' })).toBe(false)
  })

  it('should throw on undefined state', () => {
    const reducer = passState<boolean>()(() => undefined)
    expect(() => {
      reducer(undefined, { type: 'FOO' })
    }).toThrowError()
  })
})

describe('withState', () => {
  it('should overwrite state', () => {
    const reducer = withState<number>(2)(initialState<number>(1))
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toBe(2)
  })
})

describe('mergeState', () => {
  type State = {
    foo: string,
    baz?: string
  }

  it('should merge state correctly', () => {
    const reducer = mergeState<State>({ 'baz': 'qux' })(initialState<State>({ foo: 'bar' }))
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })
})

describe('compose', () => {
  it('should compose 2 reducers', () => {
    type State = {
      aaa: string,
      foo?: string,
      bar?: string,
      baz?: string
    }
    const reducer = compose<State>(
      mergeState<State>({ foo: '111' }),
      mergeState<State>({ bar: '222' }),
      mergeState<State>({ baz: '333' })
    )(initialState<State>({ aaa: 'bbb' }))
    expect(reducer(undefined, { type: 'FOO' })).toEqual({
      aaa: 'bbb',
      foo: '111',
      bar: '222',
      baz: '333'
    })
  })
})

describe('branch', () => {
  type State = {
    foo?: string,
    bar?: string
  }

  describe('both branches specified', () => {
    const reducer = branch<number>(
      (state, action) => action.type === 'FOO',
      withState<number>(1),
      withState<number>(2)
    )(initialState(0))

    it('should execute left branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'FOO' })).toBe(1)
    })

    it('should execute right branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'BAR' })).toBe(2)
    })
  })

  describe('only left branch specified', () => {
    const reducer = branch<number>(
      (state, action) => action.type === 'FOO',
      withState<number>(1)
    )(initialState(0))

    it('should execute left branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'FOO' })).toBe(1)
    })

    it('should pass the state if test returns false', () => {
      expect(reducer(undefined, { type: 'BAR' })).toBe(0)
    })
  })
})

describe('withActionType', () => {
  type State = {
    foo?: string
    baz?: string
  }

  it('should execute reducer when action matches', () => {
    const reducer = withActionType<string, State>(
      'FOO',
      mergeState({ foo: 'bar' })
    )(initialState<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })

  it('should not execute reducer when action doe not match', () => {
    const reducer = withActionType<string, State>(
      'FOO',
      mergeState({ foo: 'bar' })
    )(initialState<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'BAR' })
    expect(newState).toEqual({
      baz: 'qux'
    })
  })
})

describe('nest', () => {
  it('should call nested reducer and merge results', () => {
    type State = {
      foo: string
    }
    const reducer = nest<string, State>('foo', always('bar'))(initialState<State>({ foo: '' }))
    expect(reducer(undefined, { type: 'FOO' })).toEqual({ foo: 'bar' })
  })

  it('should handle complex nesting', () => {
    type State = {
      foo: string
      bar: number
      baz: boolean
    }
    const reducer = compose(
      nest<string, State>(
        'foo',
        withActionType('FOO', withState('yep'))(identity())
      ),
      nest<number, State>(
        'bar',
        withActionType('BAR', elevate<number>(state => state + 1))(identity())
      ),
      nest<boolean, State>(
        'baz',
        elevate<boolean>(state => !state)(identity())
      )
    )(initialState<State>({
      foo: 'nope',
      bar: 0,
      baz: false
    }))

    const state1 = reducer(undefined, { type: 'FOO' })
    expect(state1).toEqual({
      foo: 'yep',
      bar: 0,
      baz: true
    })

    const state2 = reducer(reducer(undefined, { type: 'BAR' }), { type: 'BAR' })
    expect(state2).toEqual({
      foo: 'nope',
      bar: 2,
      baz: false
    })
  })
})

describe('spawn', () => {
  it('should pass the reducer if test did not pass', () => {
    const action = { type: 'xxx' }
    const reducer = compose(
      trigger(
        (state, action) => false,
        (state, action) => withState('foo')
      ),
      withState('bar')
    )(initialState('initial'))

    const newState1 = reducer(undefined, action)
    expect(newState1).toBe('bar')
    const newState2 = reducer(newState1, action)
    expect(newState2).toBe('bar')
  })

  it('should spawn a new reducer and create it only once', () => {
    const action = { type: 'xxx' }
    let counter = 0
    const barHor = sinon.spy(withState('bar'))
    const horCreator = sinon.spy((state, action) => withState('foo'))
    const reducer = compose(
      trigger(
        (state, action) => {
          counter++
          return counter > 1
        },
        horCreator
      ),
      barHor
    )(initialState('initial'))

    const state1 = reducer(undefined, action)
    expect(state1).toBe('bar')
    const state2 = reducer(state1, action)
    expect(state2).toBe('foo')
    const state3 = reducer(state2, action)
    expect(state3).toBe('foo')
    expect(horCreator.calledOnce).toBe(true)
    expect(barHor.calledOnce).toBe(true)
  })
})
