import { AskBuilder } from '../src/AskBuilder'
import { sparqlClient } from './_mocks'

describe('AskBuilder', () => {
  it('concatenates patterns in a single ASK query form', () => {
    // given
    const expected = `ASK {
      ?s ?p ?o .
      ?x ?y ?z .
    }`

    // when
    const query = new AskBuilder()
      .where('?s ?p ?o .')
      .where('?x ?y ?z .')
      .build()

    // then
    expect(query).toMatchQuery(expected)
  })

  it('executes as select', () => {
    // given
    const client = sparqlClient()

    // when
    new AskBuilder().execute(client)

    // then
    expect(client.selectQuery).toHaveBeenCalled()
  })
})
