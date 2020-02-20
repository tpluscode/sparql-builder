import { DescribeBuilder } from '../src/DescribeBuilder'
import { sparqlClient } from './_mocks'

describe('DescribeBuilder', () => {
  it('executes as construct', () => {
    // given
    const client = sparqlClient()

    // when
    new DescribeBuilder().execute(client)

    // then
    expect(client.constructQuery).toHaveBeenCalled()
  })
})
