import { VALUES } from '../../src/expressions'

describe('VALUES', () => {
  it('returns empty for empty array', () => {
    // when
    const expr = VALUES().toString()

    // then
    expect(expr).toBe('')
  })

  it('builds values clause', () => {
    // given
    const bar = { foo: 'bar' }
    const baz = { foo: 'baz' }

    // when
    const expr = VALUES(bar, baz).toString()

    // then
    expect(expr).toBe(`VALUES ( ?foo )
{
( "bar" )
( "baz" )
}`)
  })

  it('uses UNDEF for undefined or null values', () => {
    // given
    const foo = { val: 'foo' }
    const bar = { val: null }
    const baz = { }

    // when
    const expr = VALUES(foo, bar, baz).toString()

    // then
    expect(expr).toBe(`VALUES ( ?val )
{
( "foo" )
( UNDEF )
( UNDEF )
}`)
  })
})
