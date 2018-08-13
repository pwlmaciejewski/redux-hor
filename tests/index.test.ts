import 'jest'
import * as hor from '../src'

describe('initialState', () => {
  type State = {
    foo: string
  }

  it('should set initial state when state is undefined', () => {
    const reducer = hor.initialState<State>({ foo: 'bar' })
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toEqual({ foo: 'bar' })
  })

  it('should pass state is it is not undefined', () => {
    const reducer = hor.initialState<State>({ foo: 'bar' })
    const newState = reducer({ foo: 'xxx' }, { type: 'FOO' })
    expect(newState).toEqual({ foo: 'xxx' })
  })
})

describe('mergeState', () => {
  type State = {
    foo: string,
    baz?: string
  }

  it('should merge state correctly', () => {
    const state = { foo: 'bar' }
    const reducer = hor.mergeState<State>({ 'baz': 'qux' })
    const newState = reducer(state, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })
})

describe('withActionType', () => {
  type State = {
    foo?: string
    baz?: string
  }

  it('should execute reducer when action matches', () => {
    const initialsState = hor.initialState<State>({ baz: 'qux' })
    const reducer = hor.withActionType<string, State>('FOO', hor.mergeState({ foo: 'bar' }))(initialsState)
    const newState = reducer({ baz: 'qux' }, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })

  it('should not execute reducer when action doe not match', () => {
    const initialsState = hor.initialState<State>({ baz: 'qux' })
    const reducer = hor.withActionType<string, State>('FOO', hor.mergeState({ foo: 'bar' }))(initialsState)
    const newState = reducer({ baz: 'qux' }, { type: 'BAR' })
    expect(newState).toEqual({
      baz: 'qux'
    })
  })
})
