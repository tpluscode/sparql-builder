import { AskQuery, ConstructQuery, QueryOptions, SelectQuery, UpdateQuery } from 'sparql-http-client'
import { SparqlTemplateResult } from '@tpluscode/rdf-string'

interface SparqlBuildOptions {
  base?: string
}

export type SparqlExecuteOptions = QueryOptions & SparqlBuildOptions

export interface SparqlQuery {
  build(options?: SparqlBuildOptions): string
  _getTemplateResult(): SparqlTemplateResult
}

export interface SparqlQueryExecutable {
  execute<TQuery extends SelectQuery<any>>(client: TQuery, requestInit?: SparqlExecuteOptions): ReturnType<TQuery['select']>
}

export interface SparqlGraphQueryExecutable {
  execute<TQuery extends ConstructQuery<any>>(client: TQuery, requestInit?: SparqlExecuteOptions): ReturnType<TQuery['construct']>
}

export interface SparqlUpdateExecutable {
  execute<TQuery extends UpdateQuery<any>>(client: TQuery, requestInit?: SparqlExecuteOptions): ReturnType<TQuery['update']>
}

export interface SparqlAskExecutable {
  execute<TQuery extends AskQuery<any>>(client: TQuery, requestInit?: SparqlExecuteOptions): ReturnType<TQuery['ask']>
}

type TBuilder = Pick<SparqlQuery, 'build'> & Pick<SparqlTemplateResult, '_toPartialString'>

// eslint-disable-next-line no-unused-vars
export default function Builder<T extends SparqlQuery>(): TBuilder {
  return {
    build(this: SparqlQuery, { base }: SparqlBuildOptions = {}): string {
      return this._getTemplateResult().toString({
        base,
      })
    },
    _toPartialString(this: SparqlQuery, options: any) {
      return this._getTemplateResult()._toPartialString(options)
    },
  }
}
