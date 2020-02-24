import { namedNode, variable } from '@rdfjs/data-model'
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

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = 'DESCRIBE ?foo LIMIT 100 OFFSET 200'

    // when
    const actual = DESCRIBE`${variable('foo')}`.LIMIT(100).OFFSET(200).build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
