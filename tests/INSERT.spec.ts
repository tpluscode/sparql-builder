import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { sparqlClient } from './_mocks'
import { INSERT } from '../src'

const owl = namespace(prefixes.owl)
const schema = namespace(prefixes.schema)

describe('INSERT', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `INSERT {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = INSERT`?s ?p ?o .`.build()

    // then
    expect(query).toMatchQuery(expected)
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
    expect(query).toMatchQuery(expected)
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
    expect(query).toMatchQuery(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await INSERT``.execute(client)

    // then
    expect(client.updateQuery).toHaveBeenCalled()
  })
})
