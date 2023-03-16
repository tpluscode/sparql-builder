import { AskQuery, ConstructQuery, QueryOptions, SelectQuery, UpdateQuery } from 'sparql-http-client'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import type { NamespaceBuilder } from '@rdfjs/namespace'
import prologue, { PrologueBuilder } from './partials/prologue'

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
    _toPartialString(this: SparqlQuery, options: any) {
      let result = this._getTemplateResult()
      if (this.type === 'SELECT') {
        result = sparql`{ ${result} }`
      }

      return result._toPartialString(options)
    },
  } as any
}
