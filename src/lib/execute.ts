import type { Client } from 'sparql-http-client'
import { QueryError } from './QueryError.js'
import {
  SparqlAskExecutable,
  SparqlExecuteOptions,
  SparqlGraphQueryExecutable,
  SparqlQuery,
  SparqlQueryExecutable,
  SparqlUpdateExecutable,
} from './index.js'

interface QueryAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: unknown[]): any
}

function buildAndRun<TAction extends QueryAction>(builder: SparqlQuery, clientExecute: TAction, { logQuery, ...requestInit }: SparqlExecuteOptions = {}): ReturnType<TAction> {
  const query = builder.build(requestInit)
  logQuery?.(query)

  try {
    return clientExecute(query, requestInit)
  } catch (e) {
    throw new QueryError(query, e)
  }
}

export const update: SparqlUpdateExecutable = {
  execute<TClient extends Client>(this: SparqlQuery, client: TClient, requestInit: SparqlExecuteOptions): ReturnType<TClient['query']['update']> {
    return buildAndRun<TClient['query']['update']>(this, client.query.update.bind(client.query), requestInit)
  },
}

export const ask: SparqlAskExecutable = {
  execute<TClient extends Client>(this: SparqlQuery, client: TClient, requestInit: SparqlExecuteOptions): ReturnType<TClient['query']['ask']> {
    return buildAndRun<TClient['query']['ask']>(this, client.query.ask.bind(client.query), requestInit)
  },
}

export const select: SparqlQueryExecutable = {
  execute<TClient extends Client>(this: SparqlQuery, client: TClient, requestInit: SparqlExecuteOptions): ReturnType<TClient['query']['select']> {
    return buildAndRun<TClient['query']['select']>(this, client.query.select.bind(client.query), requestInit)
  },
}

export const graph: SparqlGraphQueryExecutable = {
  execute<TClient extends Client>(this: SparqlQuery, client: TClient, requestInit: SparqlExecuteOptions): ReturnType<TClient['query']['construct']> {
    return buildAndRun<TClient['query']['construct']>(this, client.query.construct.bind(client.query), requestInit)
  },
}
