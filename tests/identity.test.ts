import 'jest'
import { identity } from '../src'

describe('identity', () => {
  it('should pass the state if it is defined', () => {
    const reducer = identity()
    expect(reducer({ foo: 'bar' }, { type: 'foo' })).toEqual({ foo: 'bar' })
  })

  it('should throw an error if the state is undefined', () => {
    const reducer = identity()
    expect(() => {
      reducer(undefined, { type: 'foo' })
    }).toThrow()
  })
})
