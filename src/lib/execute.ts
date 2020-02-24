import { SparqlHttpClient } from 'sparql-http-client'
import debug from 'debug'
import { Term } from 'rdf-js'
import { SparqlQueryBuilder, SparqlQueryExecutable } from './index'

const logQuery = debug('SPARQL')
const logQueryError = logQuery.extend('error')

function checkResponse(query: string) {
  return function assertSuccessfulResponse(response: Response): Response {
    if (response.ok) {
      return response
    }

    logQueryError('Failed query %s', query)
    throw new Error(response.statusText)
  }
}

export const update: SparqlQueryExecutable<void> = {
  async execute(this: SparqlQueryBuilder, client: SparqlHttpClient, requestInit: RequestInit): Promise<void> {
    await client.updateQuery(this.build(), requestInit).then(checkResponse(this.build()))
  },
}

export const ask: SparqlQueryExecutable<boolean> = {
  async execute(this: SparqlQueryBuilder, client: SparqlHttpClient, requestInit: RequestInit): Promise<boolean> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.boolean
  },
}

export const select: SparqlQueryExecutable<readonly Record<string, Term>[]> = {
  async execute(this: SparqlQueryBuilder, client: SparqlHttpClient, requestInit: RequestInit): Promise<readonly Record<string, Term>[]> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.results.bindings
  },
}

export const graph: SparqlQueryExecutable<Response> = {
  async execute(this: SparqlQueryBuilder, client: SparqlHttpClient<Response>, requestInit: RequestInit): Promise<Response> {
    return client.constructQuery(this.build(), requestInit).then(checkResponse(this.build()))
  },
}
