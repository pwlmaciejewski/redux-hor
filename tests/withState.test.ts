import 'jest'
import { withState, init } from '../src'

describe('withState', () => {
  it('should overwrite state', () => {
    const reducer = withState(2)(init(1))
    const newState = reducer(undefined, { type: 'FOO' })
    expect(newState).toBe(2)
  })
})