import { sparql } from '@tpluscode/rdf-string'
import { expect } from 'chai'
import { UNION } from '../../src/expressions.js'

describe('UNION', () => {
  it('returns empty for empty arg list', () => {
    // when
    const union = UNION().toString()

    // then
    expect(union).to.eq('')
  })

  it('returns a single argument without wrapping in BGP', () => {
    // given
    const patterns = sparql`<foo> <bar> <baz> .`

    // when
    const union = UNION(patterns).toString()

    // then
    expect(union).to.eq('<foo> <bar> <baz> .')
  })

  it('combines multiple args in UNION', () => {
    // given
    const patterns = [
      sparql`<foo> <bar> <baz> .`,
      sparql`<A> <B> <C> .`,
      sparql`<X> <Y> <Z> .`,
    ]

    // when
    const union = UNION(...patterns).toString()

    // then
    expect(union).to.eq(`{ 
    <foo> <bar> <baz> . 
  } UNION {
      <A> <B> <C> .
    } UNION {
      <X> <Y> <Z> .
    }`)
  })

  it('combines multiple strings in UNION', () => {
    // given
    const patterns = [
      '<foo> <bar> <baz> .',
      '<A> <B> <C> .',
      '<X> <Y> <Z> .',
    ]

    // when
    const union = UNION(...patterns).toString()

    // then
    expect(union).to.eq(`{ 
    <foo> <bar> <baz> . 
  } UNION {
      <A> <B> <C> .
    } UNION {
      <X> <Y> <Z> .
    }`)
  })
})
