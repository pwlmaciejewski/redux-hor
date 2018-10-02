import 'jest'
import { onAction, merge, init } from '../src'

describe('onAction', () => {
  type State = {
    foo?: string
    baz?: string
  }

  it('should execute reducer when action matches', () => {
    const reducer = onAction<string, State>(
      'FOO',
      merge({ foo: 'bar' })
    )(init<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })

  it('should not execute reducer when action does not match', () => {
    const reducer = onAction<string, State>(
      'FOO',
      merge({ foo: 'bar' })
    )(init<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'BAR' })
    expect(newState).toEqual({
      baz: 'qux'
    })
  })
})