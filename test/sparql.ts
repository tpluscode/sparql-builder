import { Parser } from 'sparqljs'
import { Assertion, AssertionError } from 'chai'

const sparqlParser = new Parser()

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface TypeComparison {
      query(expected: string): void
    }
  }
}

Assertion.addMethod('query', function (this: Chai.AssertionStatic, expected: string) {
  const received = this._obj
  let expectedQuery: any
  try {
    expectedQuery = sparqlParser.parse(expected)
  } catch (e) {
    throw new AssertionError(`Failed to parse expected query:\n ${expected}`)
  }
  let actualQuery: any
  try {
    actualQuery = sparqlParser.parse(received)
  } catch (e: any) {
    throw new AssertionError(`Failed to parse actual query. 
     ${e.message}.
     
     Query was:
     ${received.toString()}
   `)
  }

  new Assertion(actualQuery).to.deep.equal(expectedQuery)
})
