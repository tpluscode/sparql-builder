import { namedNode } from '@rdfjs/data-model'
import { sparqlClient } from './_mocks'
import { DESCRIBE } from '../src'

describe('DESCRIBE', () => {
  it('executes a construct', async () => {
    // given
    const client = sparqlClient()

    // when
    await DESCRIBE``.execute(client)

    // then
    expect(client.constructQuery).toHaveBeenCalled()
  })

  it('builds a DESCRIBE without WHERE', () => {
    // given
    const expected = 'DESCRIBE <urn:foo:bar>'

    // when
    const actual = DESCRIBE`${namedNode('urn:foo:bar')}`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
