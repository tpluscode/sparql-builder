import { Parser } from 'sparqljs'
import 'isomorphic-fetch'

const sparqlParser = new Parser()

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchQuery(expected: string): R
    }
  }
}

expect.extend({
  toMatchQuery(received: string, expected: string) {
    const expectedQuery = sparqlParser.parse(expected)
    const actualQuery = sparqlParser.parse(received)

    expect(actualQuery).toMatchObject(expectedQuery)

    return {
      pass: true,
      message: () => 'Queries match',
    }
  },
})
