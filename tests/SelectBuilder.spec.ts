import { SelectBuilder } from '../src/SelectBuilder'
import { sparqlClient } from './_mocks'

describe('DescribeBuilder', () => {
  it('executes as construct', () => {
    // given
    const client = sparqlClient()

    // when
    new SelectBuilder().execute(client)

    // then
    expect(client.selectQuery).toHaveBeenCalled()
  })
})
