import { xsd } from '@tpluscode/rdf-ns-builders'
import RDF from '@rdfjs/data-model'
import { expect } from 'chai'
import { IN } from '../../src/expressions.js'

describe('IN', () => {
  it('returns empty IN clause for empty array', () => {
    // when
    const expr = IN().toString()

    // then
    expect(expr).to.eq('IN (  )')
  })

  it('combines items in comma-separated list', () => {
    // given
    const items = [
      RDF.literal('foo', xsd.normalizedString),
      xsd.anyType,
      RDF.variable('foo'),
      10.6,
    ]

    // when
    const expr = IN(...items)._toPartialString({ prologue: false }).value

    // then
    expect(expr).to.eq('IN ( "foo"^^xsd:normalizedString, xsd:anyType, ?foo, 10.6 )')
  })
})
