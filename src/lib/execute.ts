import { QueryRequestInit, SparqlHttpClient } from 'sparql-http-client'
import debug from 'debug'
import { Term } from 'rdf-js'
import {
  SparqlAskExecutable,
  SparqlExecuteOptions,
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

function buildAndRun<T extends Response>(builder: SparqlQuery, clientExecute: (query: string, options?: QueryRequestInit) => Promise<T>, requestInit: SparqlExecuteOptions): Promise<T> {
  const query = builder.build(requestInit)
  logQuery(query)

  return clientExecute(query, requestInit).then(checkResponse(query))
}

export const update: SparqlUpdateExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: SparqlExecuteOptions): Promise<void> {
    await buildAndRun(this, client.updateQuery, requestInit)
  },
}

export const ask: SparqlAskExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: SparqlExecuteOptions): Promise<boolean> {
    const response = await buildAndRun(this, client.selectQuery, requestInit)
    const json = await response.json()
    return json.boolean
  },
}

export const select: SparqlQueryExecutable = {
  async execute(this: SparqlQuery, client: SparqlHttpClient, requestInit: SparqlExecuteOptions): Promise<readonly Record<string, Term>[]> {
    const response = await buildAndRun(this, client.selectQuery, requestInit)
    const json = await response.json()
    return json.results.bindings
  },
}

export const graph: SparqlGraphQueryExecutable = {
  async execute<T extends Response>(this: SparqlQuery, client: SparqlHttpClient<T>, requestInit: SparqlExecuteOptions): Promise<T> {
    return buildAndRun(this, client.constructQuery, requestInit)
  },
}
