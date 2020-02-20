import { DeleteInsertBuilder } from '../src/DeleteInsertBuilder'
import { sparqlClient } from './_mocks'

describe('DeleteInsertBuilder', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `DELETE {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = new DeleteInsertBuilder()
      .delete('?s ?p ?o .')
      .build()

    // then
    expect(query).toMatchQuery(expected)
  })

  it('executes as update', () => {
    // given
    const client = sparqlClient()

    // when
    new DeleteInsertBuilder().execute(client)

    // then
    expect(client.updateQuery).toHaveBeenCalled()
  })
})
