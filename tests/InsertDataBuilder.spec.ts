import { InsertDataBuilder } from '../src/InsertDataBuilder'
import { sparqlClient } from './_mocks'

describe('DescribeBuilder', () => {
  it('executes as construct', () => {
    // given
    const client = sparqlClient()

    // when
    new InsertDataBuilder().execute(client)

    // then
    expect(client.updateQuery).toHaveBeenCalled()
  })
})
