import 'jest'
import { withContext, merge, init } from '../src'

describe('withContext', () => {
  it('should pass the context to the hor creator', () => {
    interface State {
      foo?: string
      counter: number
    }

    const hor = withContext<number, State>(
      state => state.foo ? 2 : 1,
      counter => merge<State>({
        counter,
        foo: 'bar'
      })
    )

    const reducer = hor(init<State>({ counter: 0 }))

    const state1 = reducer(undefined, { type: 'foo' })
    expect(state1).toEqual({
      foo: 'bar',
      counter: 1
    })

    const state2 = reducer(state1, { type: 'foo' })
    expect(state2).toEqual({
      foo: 'bar',
      counter: 2
    })
  })

  it('should pass the state if context is undefined', () => {
    const hor = withContext(
      state => undefined,
      c => merge({ foo: 'baz' })
    )
    const reducer = hor(init({ foo: 'bar' }))
    expect(reducer(undefined, { type: 'foo' })).toEqual({ foo: 'bar' })
  })

  it('should not pass the state if context is falsy bout not undefined', () => {
    const hor = withContext(
      state => false,
      c => merge({ foo: 'baz' })
    )
    const reducer = hor(init({ foo: 'bar' }))
    expect(reducer(undefined, { type: 'foo' })).toEqual({ foo: 'baz' })
  })
})
