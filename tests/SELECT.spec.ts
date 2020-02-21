import { defaultGraph, namedNode } from '@rdfjs/data-model'
import { SELECT } from '../src'
import { sparqlClient } from './_mocks'

describe('SELECT', () => {
  it('executes as select', () => {
    // given
    const client = sparqlClient()

    // when
    SELECT``.execute(client)

    // then
    expect(client.selectQuery).toHaveBeenCalled()
  })

  it('creates a simple select/where', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`?s ?p ?o`.WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('adds FROM when default graph set', () => {
    // given
    const expected = 'SELECT * FROM <urn:foo:bar> WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`*`.FROM(namedNode('urn:foo:bar')).WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('does not add FROM when graph is defaultGraph', () => {
    // given
    const expected = 'SELECT * WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`*`.FROM(defaultGraph()).WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
