import { sparqlClient } from './_mocks'
import { DELETE } from '../src'

describe('DeleteInsertBuilder', () => {
  it('adds an empty WHERE if no pattern provided', () => {
    // given
    const expected = `DELETE {
      ?s ?p ?o .
    } WHERE {}`

    // when
    const query = DELETE`?s ?p ?o .`.build()

    // then
    expect(query).toMatchQuery(expected)
  })

  it('executes as update', async () => {
    // given
    const client = sparqlClient()

    // when
    await DELETE``.execute(client)

    // then
    expect(client.updateQuery).toHaveBeenCalled()
  })
})
