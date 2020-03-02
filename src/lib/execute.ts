import { SparqlHttpClient } from 'sparql-http-client'
import debug from 'debug'
import { Term } from 'rdf-js'
import {
  SparqlAskExecutable,
  SparqlGraphQueryExecutable,
  SparqlQuery,
  SparqlQueryExecutable,
  SparqlUpdateExecutable,
} from './index'

const logQuery = debug('SPARQL')
const logQueryError = logQuery.extend('error')

function checkResponse<T extends Response>(query: string) {
  return function assertSuccessfulResponse(response: T): T {
    if (response.ok) {
      return response
    }

    logQueryError('Failed query %s', query)
    throw new Error(response.statusText)
  }
}

export const update: SparqlUpdateExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: RequestInit): Promise<void> {
    await client.updateQuery(this.build(), requestInit).then(checkResponse(this.build()))
  },
}

export const ask: SparqlAskExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: RequestInit): Promise<boolean> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.boolean
  },
}

export const select: SparqlQueryExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: RequestInit): Promise<readonly Record<string, Term>[]> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.results.bindings
  },
}

export const graph: SparqlGraphQueryExecutable = {
  async execute<T extends Response>(this: SparqlQuery, client: SparqlHttpClient<T>, requestInit: RequestInit): Promise<T> {
    return client.constructQuery(this.build(), requestInit).then(checkResponse(this.build()))
  },
}
