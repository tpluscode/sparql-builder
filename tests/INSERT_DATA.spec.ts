import { INSERT } from '../src'
import { owl } from '@tpluscode/rdf-ns-builders'
import { sparqlClient } from './_mocks'

describe('INSERT DATA', () => {
  it('builds correct query', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
INSERT DATA { <http://example.com> owl:sameAs <http://example.org> . }`

    // when
    const actual = INSERT.DATA`<http://example.com> ${owl.sameAs} <http://example.org>`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await INSERT.DATA`<http://example.com> owl:sameAs <http://example.org>`.execute(client)

    // then
    expect(client.update).toHaveBeenCalled()
  })

  it('can chain multiple quad data calls', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
INSERT DATA { 
    <http://example.com/bar> owl:sameAs <http://example.org/bar> .
    <http://example.com/foo> owl:sameAs <http://example.org/foo> .
}`

    // when
    const actual = INSERT
      .DATA`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .DATA`<http://example.com/foo> ${owl.sameAs} <http://example.org/foo> .`
      .build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
