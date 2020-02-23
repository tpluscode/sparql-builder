import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { sparqlClient } from './_mocks'
import { INSERT } from '../src'

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
