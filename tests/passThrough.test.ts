import 'jest'
import { passThrough, init } from '../src'

describe('passState', () => {
  it('should pass falsy state', () => {
    const reducer = passThrough()(init(false))
    expect(reducer(undefined, { type: 'FOO' })).toBe(false)
  })

  it('should throw on undefined state', () => {
    const reducer = passThrough()(() => undefined)
    expect(() => {
      reducer(undefined, { type: 'FOO' })
    }).toThrowError()
  })
})
