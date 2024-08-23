import RDF from '@zazuko/env'
import chai, { expect } from 'chai'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import { DESCRIBE } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('DESCRIBE', () => {
  chai.use(jestSnapshotPlugin())

  it('executes a construct', async () => {
    // given
    const client = sparqlClient()

    // when
    await DESCRIBE``.execute(client)

    // then
    expect(client.query.construct).to.have.been.called
  })

  it('builds a DESCRIBE without WHERE', () => {
    // given
    const expected = 'DESCRIBE <urn:foo:bar>'

    // when
    const actual = DESCRIBE`${RDF.namedNode('urn:foo:bar')}`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const query = DESCRIBE`?foo`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .WHERE`?foo a ?bar`
      .build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = 'DESCRIBE ?foo LIMIT 100 OFFSET 200'

    // when
    const actual = DESCRIBE`${RDF.variable('foo')}`.LIMIT(100).OFFSET(200).build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('supports ORDER BY', () => {
    // given
    const expected = 'DESCRIBE ?foo WHERE { ?foo a ?bar } ORDER BY ?bar LIMIT 100 OFFSET 200'
    const foo = RDF.variable('foo')
    const bar = RDF.variable('bar')

    // when
    const actual = DESCRIBE`${foo}`
      .WHERE`${foo} a ${bar}`
      .ORDER().BY(bar)
      .LIMIT(100)
      .OFFSET(200)
      .build()

    // then
    expect(actual).to.be.query(expected)
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
    expect(actual).to.be.query(expected)
  })

  it('can be constructed with a base', () => {
    // given
    const ns = RDF.namespace('http://example.com/')
    const expected = `BASE <http://example.com/>

    DESCRIBE <person>`

    // when
    const actual = DESCRIBE`${ns.person}`.build({
      base: 'http://example.com/',
    })

    // then
    expect(actual).to.be.query(expected)
  })
})
