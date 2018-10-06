import 'jest'
import { merge, init, onAction, elevate } from '../src'
import { Action } from 'redux';

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
