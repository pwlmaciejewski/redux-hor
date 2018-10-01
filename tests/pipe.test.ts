import 'jest'
import { pipe } from '../src'

describe('pipe', () => {
  it('should pass result of the first reducer as an input of the second reducer', () => {
    interface S {
      foo: boolean
      bar: boolean
    }
    const reducer = pipe(
      (state: S) => ({ ...state, foo: true, bar: false }),
      (state: S) => ({ ...state, bar: true })
    )
    expect(reducer(undefined, { type: 'foo' })).toEqual({ foo: true, bar: true })
  })
})