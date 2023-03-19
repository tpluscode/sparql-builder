import { owl, schema } from '@tpluscode/rdf-ns-builders'
import RDF from '@rdfjs/data-model'
import { expect } from 'chai'
import { INSERT } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('INSERT', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `INSERT {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = INSERT`?s ?p ?o .`.build()

    // then
    expect(query).to.be.query(expected)
  })

  it('combines multiple INSERT calls', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>

    INSERT {
      <http://example.com/bar> owl:sameAs <http://example.org/bar> .
      <http://example.com/foo> owl:sameAs <http://example.org/foo> .
    } WHERE {}`

    // when
    const query = INSERT`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .INSERT`<http://example.com/foo> ${owl.sameAs} <http://example.org/foo> .`
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const query = INSERT`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(query).to.matchSnapshot(this)
  })

  it('has a WHERE method', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/> 
    
    INSERT {
      ?s ?p ?o .
    } WHERE {
      ?s a schema:Person ; ?p ?o
    }`

    // when
    const query = INSERT`?s ?p ?o .`
      .WHERE`?s a ${schema.Person} ; ?p ?o`
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await INSERT``.execute(client)

    // then
    expect(client.update).to.have.been.called
  })
})
