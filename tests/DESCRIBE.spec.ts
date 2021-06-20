import namespace from '@rdfjs/namespace'
import * as RDF from '@rdfjs/data-model'
import { DESCRIBE } from '../src'
import { sparqlClient } from './_mocks'

describe('DESCRIBE', () => {
  it('executes a construct', async () => {
    // given
    const client = sparqlClient()

    // when
    await DESCRIBE``.execute(client)

    // then
    expect(client.construct).toHaveBeenCalled()
  })

  it('builds a DESCRIBE without WHERE', () => {
    // given
    const expected = 'DESCRIBE <urn:foo:bar>'

    // when
    const actual = DESCRIBE`${RDF.namedNode('urn:foo:bar')}`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = 'DESCRIBE ?foo LIMIT 100 OFFSET 200'

    // when
    const actual = DESCRIBE`${RDF.variable('foo')}`.LIMIT(100).OFFSET(200).build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('supports FROM (NAMED)', () => {
    // given
    const expected = `DESCRIBE ?foo
      FROM <http://example.com/foo>
      FROM NAMED <http://example.com/bar>`

    // when
    const actual = DESCRIBE`${RDF.variable('foo')}`
      .FROM(RDF.namedNode('http://example.com/foo'))
      .FROM().NAMED(RDF.namedNode('http://example.com/bar')).build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('can be constructed with a base', () => {
    // given
    const ns = namespace('http://example.com/')
    const expected = `BASE <http://example.com/>

    DESCRIBE <person>`

    // when
    const actual = DESCRIBE`${ns.person}`.build({
      base: 'http://example.com/',
    })

    // then
    expect(actual).toMatchQuery(expected)
  })
})
