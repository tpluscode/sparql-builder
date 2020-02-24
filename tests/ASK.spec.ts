import { sparqlClient } from './_mocks'
import { ASK } from '../src'

describe('ASK', () => {
  it('creates expected query', () => {
    // given
    const expected = `ASK {
      ?s ?p ?o .
      ?x ?y ?z .
    }`

    // when
    const query = ASK`?s ?p ?o . ?x ?y ?z .`.build()

    // then
    expect(query).toMatchQuery(expected)
  })

  it('executes as select', async () => {
    // given
    const client = sparqlClient()

    // when
    await ASK``.execute(client)

    // then
    expect(client.selectQuery).toHaveBeenCalled()
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = `ASK {
      ?s ?p ?o .
    } LIMIT 10 OFFSET 20`

    // when
    const query = ASK`?s ?p ?o .`.LIMIT(10).OFFSET(20).build()

    // then
    expect(query).toMatchQuery(expected)
  })
})
