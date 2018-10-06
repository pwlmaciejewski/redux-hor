import 'jest'
import { init } from '../src'

describe('init', () => {
  it('should return the initial state if input state is undefined', () => {
    const reducer = init(true)
    expect(reducer(undefined, { type: 'foo' })).toBe(true)
  })

  it('should pass the state if it is defined', () => {
    const reducer = init(true)
    expect(reducer(false, { type: 'foo' })).toBe(false)
  })
})
