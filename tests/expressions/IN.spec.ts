import { xsd } from '@tpluscode/rdf-ns-builders'
import { literal, variable } from '@rdf-esm/data-model'
import { IN } from '../../src/expressions'

describe('IN', () => {
  it('returns empty IN clause for empty array', () => {
    // when
    const expr = IN().toString()

    // then
    expect(expr).toBe('IN (  )')
  })

  it('combines items in comma-separated list', () => {
    // given
    const items = [
      literal('foo', xsd.normalizedString),
      xsd.anyType,
      variable('foo'),
      10.6,
    ]

    // when
    const expr = IN(...items)._toPartialString({ prologue: false }).value

    // then
    expect(expr).toBe('IN ( "foo"^^xsd:normalizedString, xsd:anyType, ?foo, 10.6 )')
  })
})
