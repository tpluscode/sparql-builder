import { foaf, owl, schema } from '@tpluscode/rdf-ns-builders'
import { DELETE } from '../src'
import { sparqlClient } from './_mocks'

describe('DELETE', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `DELETE {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = DELETE`?s ?p ?o .`.build()

    // then
    expect(query).toMatchQuery(expected)
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
    expect(query).toMatchQuery(expected)
  })

  it('skips empty INSERT clause', () => {
    // when
    const query = DELETE`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .build()

    // then
    expect(query).not.toContain('INSERT')
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
    expect(query).toMatchQuery(expected)
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
    expect(query).toMatchQuery(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await DELETE``.execute(client)

    // then
    expect(client.update).toHaveBeenCalled()
  })
})
