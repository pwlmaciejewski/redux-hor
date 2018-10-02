import 'jest'
import { onAction, merge, init, withContext, withState } from '../src'
import { Action } from 'redux';

describe('onAction', () => {
  type State = {
    foo?: string
    baz?: string
  }

  it('should execute reducer when action matches', () => {
    const reducer = onAction<State>(
      { type: 'FOO' },
      merge({ foo: 'bar' })
    )(init<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'FOO' })
    expect(newState).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  })

  it('should not execute reducer when action does not match', () => {
    const reducer = onAction<State>(
      { type: 'FOO' },
      merge({ foo: 'bar' })
    )(init<State>({ baz: 'qux' }))
    const newState = reducer({ baz: 'qux' }, { type: 'BAR' })
    expect(newState).toEqual({
      baz: 'qux'
    })
  })

  it('should support an array of types', () => {
    interface State {
      foo: number
    }

    interface Payload {
      counter: number
    }

    interface MyAction extends Action<string> {
      payload: Payload
    }

    const fooAction: MyAction = {
      type: 'FOO',
      payload: {
        counter: 1
      }
    }

    const barAction: MyAction = {
      type: 'BAR',
      payload: {
        counter: 2
      }
    }

    const reducer = onAction<State, MyAction>(
      [fooAction, barAction],
      withContext(
        (state, action) => action.payload,
        p => withState({ foo: p.counter })
      )
    )(init({ foo: 0 }))

    expect(reducer(undefined, fooAction)).toEqual({ foo: 1 })
    expect(reducer(undefined, barAction)).toEqual({ foo: 2 })
  })
})