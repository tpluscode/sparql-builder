import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { CONSTRUCT } from '../src'
import { sparqlClient } from './_mocks'

const schema = namespace(prefixes.schema)

describe('CONSTRUCT', () => {
  it('executes as construct', () => {
    // given
    const client = sparqlClient()

    // when
    CONSTRUCT``.execute(client)

    // then
    expect(client.constructQuery).toHaveBeenCalled()
  })

  it('generates empty WHERE clause by default', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT { <http://example.com/me> a schema:Person } WHERE {}`

    // when
    const actual = CONSTRUCT`<http://example.com/me> a ${schema.Person}`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
