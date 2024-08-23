import RDF from '@zazuko/env'
import chai, { expect } from 'chai'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import { DELETE } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('DELETE DATA', () => {
  chai.use(jestSnapshotPlugin())

  it('builds correct query', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
DELETE DATA { <http://example.com> owl:sameAs <http://example.org> . }`

    // when
    const actual = DELETE.DATA`<http://example.com> ${RDF.ns.owl.sameAs} <http://example.org>`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await DELETE.DATA`<http://example.com> owl:sameAs <http://example.org>`.execute(client)

    // then
    expect(client.query.update).to.have.been.called
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const query = DELETE.DATA`<http://example.com/bar> ${RDF.ns.owl.sameAs} <http://example.org/bar> .`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('can delete triples', function () {
    // given
    const data = RDF.quad(
      RDF.namedNode('http://example.com/bar'),
      RDF.ns.owl.sameAs,
      RDF.namedNode('http://example.com/bar'),
    )

    // when
    const query = DELETE.DATA`${data}`.build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('can delete quads', function () {
    // given
    const data = RDF.quad(
      RDF.namedNode('http://example.com/bar'),
      RDF.ns.owl.sameAs,
      RDF.namedNode('http://example.com/bar'),
      RDF.namedNode('http://example.com/G'),
    )

    // when
    const query = DELETE.DATA`${data}`.build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('can delete dataset', function () {
    // given
    const data = RDF.dataset([RDF.quad(
      RDF.namedNode('http://example.com/bar'),
      RDF.ns.owl.sameAs,
      RDF.namedNode('http://example.com/bar'),
    )])

    // when
    const query = DELETE.DATA`${data}`.build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('can chain multiple quad data calls', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
DELETE DATA { 
    <http://example.com/bar> owl:sameAs <http://example.org/bar> .
    <http://example.com/foo> owl:sameAs <http://example.org/foo> .
}`

    // when
    const actual = DELETE
      .DATA`<http://example.com/bar> ${RDF.ns.owl.sameAs} <http://example.org/bar> .`
      .DATA`<http://example.com/foo> ${RDF.ns.owl.sameAs} <http://example.org/foo> .`
      .build()

    // then
    expect(actual).to.be.query(expected)
  })
})
