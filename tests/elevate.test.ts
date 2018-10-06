import 'jest'
import { elevate, init } from '../src'

describe('elevate', () => {
  it('should create a higher order reducer from reducer', () => {
    interface S {
      foo?: boolean
      bar?: boolean
    }
    const reducer = (state: S | undefined): S => ({ ...state,  foo: true })
    const hor = elevate(reducer)
    const finalReducer = hor(init<S>({ bar: true }))
    expect(finalReducer(undefined, { type: 'foo' })).toEqual({ foo: true, bar: true })
  })
})
