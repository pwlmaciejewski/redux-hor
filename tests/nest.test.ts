import 'jest'
import { nest, withState, init, compose, elevate, onAction, merge, passThrough } from '../src'

describe('nest', () => {
  it('should call nested reducer and merge results', () => {
    type State = {
      foo: string
    }
    const reducer = nest<string, State>('foo', () => withState('bar'))(init<State>({ foo: '' }))
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
        () => onAction({ type: 'FOO' }, withState('yep'))
      ),
      nest<number, State>(
        'bar',
        () => onAction({ type: 'BAR' }, elevate<number>(state => state + 1))
      ),
      nest<boolean, State>(
        'baz',
        () => elevate<boolean>(state => !state)
      )
    )(init<State>({
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

  it('should accept function that will return property name', () => {
    type State = {
      foo: string
    }
    const reducer = nest<string, State>(
      () => 'foo', 
      prop => withState(prop + 'bar')
    )(init<State>({ foo: '' }))
    expect(reducer(undefined, { type: 'FOO' })).toEqual({ foo: 'foobar' })
  })
})