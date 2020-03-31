import { QueryOptions, ConstructQuery, SelectQuery, UpdateQuery, AskQuery } from 'sparql-http-client'
import debug from 'debug'
import { BaseQuad, Quad } from 'rdf-js'
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
  async execute<TUpdate, TQuery extends UpdateQuery<TUpdate>, Q extends BaseQuad = Quad>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): Promise<TUpdate> {
    return buildAndRun(this, client.update.bind(client), requestInit)
  },
}

export const ask: SparqlAskExecutable = {
  execute<TAsk, TQuery extends AskQuery<TAsk>, Q extends BaseQuad = Quad>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): Promise<TAsk> {
    return buildAndRun(this, client.ask.bind(client), requestInit)
  },
}

export const select: SparqlQueryExecutable = {
  execute<TSelect, TQuery extends SelectQuery<TSelect>, Q extends BaseQuad = Quad>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): Promise<TSelect> {
    return buildAndRun(this, client.select.bind(client), requestInit)
  },
}

export const graph: SparqlGraphQueryExecutable = {
  execute<TConstruct, TQuery extends ConstructQuery<TConstruct>, Q extends BaseQuad = Quad>(this: SparqlQuery, client: TQuery, requestInit: SparqlExecuteOptions): Promise<TConstruct> {
    return buildAndRun(this, client.construct.bind(client), requestInit)
  },
}
