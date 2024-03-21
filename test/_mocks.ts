import sinon from 'sinon'
import type { Client, Query } from 'sparql-http-client'

export function sparqlClient(): Client<Query<any, any, any, any>, never> {
  return {
    query: {
      ask: sinon.stub(),
      select: sinon.stub(),
      construct: sinon.stub(),
      update: sinon.stub(),
    },
    store: {} as never,
  }
}
