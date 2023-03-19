import { foaf, owl, schema } from '@tpluscode/rdf-ns-builders'
import RDF from '@rdfjs/data-model'
import { expect } from 'chai'
import { DELETE } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('DELETE', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `DELETE {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = DELETE`?s ?p ?o .`.build()

    // then
    expect(query).to.be.query(expected)
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const query = DELETE`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(query).to.matchSnapshot(this)
  })

  it('combines multiple DELETE calls', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>

    DELETE {
      <http://example.com/bar> owl:sameAs <http://example.org/bar> .
      <http://example.com/foo> owl:sameAs <http://example.org/foo> .
    } WHERE {}`

    // when
    const query = DELETE`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .DELETE`<http://example.com/foo> ${owl.sameAs} <http://example.org/foo> .`
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('skips empty INSERT clause', () => {
    // when
    const query = DELETE`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .build()

    // then
    expect(query).not.to.include('INSERT')
  })

  it('has a WHERE method', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/> 
    
    DELETE {
      ?s ?p ?o .
    } WHERE {
      ?s a schema:Person ; ?p ?o
    }`

    // when
    const query = DELETE`?s ?p ?o .`
      .WHERE`?s a ${schema.Person} ; ?p ?o`
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('complete DELETE/INSERT/WHERE', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/> 
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    
    DELETE {
      ?s a foaf:Person .
    } INSERT {
      ?s a schema:Person . 
    } WHERE {
      ?s a foaf:Person .
    }`

    // when
    const query = DELETE`?s a ${foaf.Person}`
      .INSERT`?s a ${schema.Person}`
      .WHERE`?s a ${foaf.Person}`
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await DELETE``.execute(client)

    // then
    expect(client.update).to.have.been.called
  })
})
