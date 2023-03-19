import RDF from '@rdfjs/data-model'
import { expect } from 'chai'
import { VALUES } from '../../src/expressions.js'

describe('VALUES', () => {
  it('returns empty for empty array', () => {
    // when
    const expr = VALUES().toString()

    // then
    expect(expr).to.eq('')
  })

  it('builds values clause', () => {
    // given
    const bar = { foo: 'bar' }
    const baz = { foo: 'baz' }

    // when
    const expr = VALUES(bar, baz).toString()

    // then
    expect(expr).to.eq(`VALUES ( ?foo )
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
    expect(expr).to.eq(`VALUES ( ?val )
{
( "foo" )
( UNDEF )
( UNDEF )
}`)
  })

  it('handles various values', () => {
    // given
    const foo = { val: 11.6 }
    const bar = { val: true }
    const baz = { val: RDF.literal('baz', 'de') }

    // when
    const expr = VALUES(foo, bar, baz).toString()

    // then
    expect(expr).to.eq(`VALUES ( ?val )
{
( 11.6 )
( true )
( "baz"@de )
}`)
  })
})
