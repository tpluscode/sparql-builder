import { SparqlHttpClient } from 'sparql-http-client'
import { SparqlTemplateResult } from '@tpluscode/rdf-string'
import { Term } from 'rdf-js'

interface SparqlBuildOptions {
  base?: string
}

export type SparqlExecuteOptions = RequestInit & SparqlBuildOptions

export interface SparqlQuery {
  build(options?: SparqlBuildOptions): string
  _getTemplateResult(): SparqlTemplateResult
}

export interface SparqlQueryExecutable {
  execute(client: SparqlHttpClient, options?: SparqlExecuteOptions): Promise<readonly Record<string, Term>[]>
}

export interface SparqlGraphQueryExecutable {
  execute<TResponse extends Response>(client: SparqlHttpClient<TResponse>, options?: SparqlExecuteOptions): Promise<TResponse>
}

export interface SparqlUpdateExecutable {
  execute(client: SparqlHttpClient, options?: SparqlExecuteOptions): Promise<void>
}

export interface SparqlAskExecutable {
  execute(client: SparqlHttpClient, options?: SparqlExecuteOptions): Promise<boolean>
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
