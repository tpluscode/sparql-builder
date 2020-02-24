import { schema } from '@tpluscode/rdf-ns-builders'
import { CONSTRUCT } from '../src'
import { sparqlClient } from './_mocks'

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

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT { <http://example.com/me> a schema:Person } WHERE {}
    LIMIT 5 OFFSET 305`

    // when
    const actual = CONSTRUCT`<http://example.com/me> a ${schema.Person}`.LIMIT(5).OFFSET(305).build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
