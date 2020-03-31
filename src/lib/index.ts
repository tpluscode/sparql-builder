import { AskQuery, ConstructQuery, QueryOptions, SelectQuery, UpdateQuery } from 'sparql-http-client'
import { SparqlTemplateResult } from '@tpluscode/rdf-string'
import { BaseQuad, Quad } from 'rdf-js'

interface SparqlBuildOptions {
  base?: string
}

export type SparqlExecuteOptions = QueryOptions & SparqlBuildOptions

export interface SparqlQuery {
  build(options?: SparqlBuildOptions): string
  _getTemplateResult(): SparqlTemplateResult
}

export interface SparqlQueryExecutable {
  execute<TSelect, TQuery extends SelectQuery<TSelect>, Q extends BaseQuad = Quad>(client: TQuery, requestInit?: SparqlExecuteOptions): Promise<TSelect>
}

export interface SparqlGraphQueryExecutable {
  execute<TConstruct, TQuery extends ConstructQuery<TConstruct>, Q extends BaseQuad = Quad>(client: TQuery, requestInit?: SparqlExecuteOptions): Promise<TConstruct>
}

export interface SparqlUpdateExecutable {
  execute<TUpdate, TQuery extends UpdateQuery<TUpdate>, Q extends BaseQuad = Quad>(client: TQuery, requestInit?: SparqlExecuteOptions): Promise<TUpdate>
}

export interface SparqlAskExecutable {
  execute<TAsk, TQuery extends AskQuery<TAsk>, Q extends BaseQuad = Quad>(client: TQuery, requestInit?: SparqlExecuteOptions): Promise<TAsk>
}

type Builder = Pick<SparqlQuery, 'build'> & Pick<SparqlTemplateResult, '_toPartialString'>

export default function Builder<T extends SparqlQuery>(): Builder {
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
