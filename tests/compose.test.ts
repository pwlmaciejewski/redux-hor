import 'jest'
import { compose, merge, init } from '../src'

describe('compose', () => {
  it('should compose reducers', () => {
    type State = {
      aaa: string,
      foo?: string,
      bar?: string,
      baz?: string
    }
    const reducer = compose<State>(
      merge<State>({ foo: '111' }),
      merge<State>({ bar: '222' }),
      merge<State>({ baz: '333' })
    )(init<State>({ aaa: 'bbb' }))
    expect(reducer(undefined, { type: 'FOO' })).toEqual({
      aaa: 'bbb',
      foo: '111',
      bar: '222',
      baz: '333'
    })
  })
})