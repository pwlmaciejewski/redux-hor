import 'jest'
import { always } from '../src'

describe('always', () => {
  it('should always return the same predefined state', () => {
    const reducer = always(true)
    expect(reducer(false, { type: 'foo' })).toBe(true)
  })
})