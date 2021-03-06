import { owl } from '@tpluscode/rdf-ns-builders'
import { DELETE } from '../src'
import { sparqlClient } from './_mocks'

describe('DELETE DATA', () => {
  it('builds correct query', () => {
    // given
    const expected = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
DELETE DATA { <http://example.com> owl:sameAs <http://example.org> . }`

    // when
    const actual = DELETE.DATA`<http://example.com> ${owl.sameAs} <http://example.org>`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await DELETE.DATA`<http://example.com> owl:sameAs <http://example.org>`.execute(client)

    // then
    expect(client.update).toHaveBeenCalled()
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
      .DATA`<http://example.com/bar> ${owl.sameAs} <http://example.org/bar> .`
      .DATA`<http://example.com/foo> ${owl.sameAs} <http://example.org/foo> .`
      .build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
