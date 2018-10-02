import 'jest'
import { merge, init } from '../src'

describe('merge', () => {
  type State = {
    foo: string,
    baz?: string
  }

  it('should merge state correctly', () => {
    const reducer = merge<State>({ 'baz': 'qux' })(init<State>({ foo: 'bar' }))
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })
})