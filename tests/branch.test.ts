import 'jest'
import { branch, withState, init, elevate } from '../src'

describe('branch', () => {
  describe('both branches specified', () => {
    const reducer = branch<number>(
      (state, action) => action.type === 'FOO',
      withState<number>(1),
      withState<number>(2)
    )(init(0))

    it('should execute left branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'FOO' })).toBe(1)
    })

    it('should execute right branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'BAR' })).toBe(2)
    })
  })

  describe('only left branch specified', () => {
    const reducer = branch<number>(
      (state, action) => action.type === 'FOO',
      withState<number>(1)
    )(init(0))

    it('should execute left branch is test returns truth', () => {
      expect(reducer(undefined, { type: 'FOO' })).toBe(1)
    })

    it('should pass the state if test returns false', () => {
      expect(reducer(undefined, { type: 'BAR' })).toBe(0)
    })
  })

  it('should call inner reducer only once', () => {
    const counter = 0
    const innerReducer = (state = counter) => state + 1
    const reducer = branch<number>(
      state => state > 0,
      elevate(state => state + 1)
    )(innerReducer)
    expect(reducer(undefined, { type: 'bar' })).toBe(2)
  })
})
