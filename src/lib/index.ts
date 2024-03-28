import { QueryOptions, Client } from 'sparql-http-client'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import type { NamespaceBuilder } from '@rdfjs/namespace'
import type { SparqlOptions } from '@tpluscode/rdf-string'
import prologue, { PrologueBuilder } from './partials/prologue.js'

interface SparqlBuildOptions {
  base?: string
  prefixes?: Record<string, string | NamespaceBuilder>
}

export type SparqlExecuteOptions = QueryOptions & SparqlBuildOptions

export interface SparqlQuery extends PrologueBuilder {
  type: 'SELECT' | 'CONSTRUCT' | 'ASK' | 'UPDATE'
  build(options?: SparqlBuildOptions): string
  _getTemplateResult(): SparqlTemplateResult
}

export interface SparqlQueryExecutable {
  execute<TClient extends Client>(client: TClient, requestInit?: SparqlExecuteOptions): ReturnType<TClient['query']['select']>
}

export interface SparqlGraphQueryExecutable {
  execute<TClient extends Client>(client: TClient, requestInit?: SparqlExecuteOptions): ReturnType<TClient['query']['construct']>
}

export interface SparqlUpdateExecutable {
  execute<TClient extends Client>(client: TClient, requestInit?: SparqlExecuteOptions): ReturnType<TClient['query']['update']>
}

export interface SparqlAskExecutable {
  execute<TClient extends Client>(client: TClient, requestInit?: SparqlExecuteOptions): ReturnType<TClient['query']['ask']>
}

type TBuilder = Pick<SparqlQuery, 'build' | 'type'> & Pick<SparqlTemplateResult, '_toPartialString'>

// eslint-disable-next-line no-unused-vars
export default function Builder<T extends SparqlQuery>(type: SparqlQuery['type']): TBuilder & T {
  return {
    type,
    ...prologue(),
    build(this: SparqlQuery, { base, prefixes }: SparqlBuildOptions = {}): string {
      const queryResult = this._getTemplateResult().toString({
        base,
        prefixes,
      })

      if (this.prologueResult) {
        return `${this.prologueResult}\n\n${queryResult}`
      }

      return queryResult
    },
    _toPartialString(this: SparqlQuery, options: SparqlOptions) {
      let result = this._getTemplateResult()
      if (this.type === 'SELECT') {
        result = sparql`{ ${result} }`
      }

      return result._toPartialString(options)
    },
  } as TBuilder & T
}
