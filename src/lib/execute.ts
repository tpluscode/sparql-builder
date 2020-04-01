import { QueryOptions, ConstructQuery, SelectQuery, UpdateQuery, AskQuery } from 'sparql-http-client'
import debug from 'debug'
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

function buildAndRun<TResult>(builder: SparqlQuery, clientExecute: (query: string, options?: QueryOptions) => TResult, requestInit: SparqlExecuteOptions): TResult {
  const query = builder.build(requestInit)
  logQuery(query)

  try {
    return clientExecute(query, requestInit)
  } catch (e) {
    logQueryError('Failed query %s', query)
    throw e
  }
}

export const update: SparqlUpdateExecutable = {
  execute<TQuery extends UpdateQuery<any>>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): ReturnType<TQuery['update']> {
    return buildAndRun(this, client.update.bind(client) as any, requestInit)
  },
}

export const ask: SparqlAskExecutable = {
  execute<TQuery extends AskQuery<any>>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): ReturnType<TQuery['ask']> {
    return buildAndRun(this, client.ask.bind(client) as any, requestInit)
  },
}

export const select: SparqlQueryExecutable = {
  execute<TQuery extends SelectQuery<any>>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): ReturnType<TQuery['select']> {
    return buildAndRun(this, client.select.bind(client) as any, requestInit)
  },
}

export const graph: SparqlGraphQueryExecutable = {
  execute<TQuery extends ConstructQuery<any>>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): ReturnType<TQuery['construct']> {
    return buildAndRun(this, client.construct.bind(client) as any, requestInit)
  },
}
