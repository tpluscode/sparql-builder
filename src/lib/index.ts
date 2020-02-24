import { SparqlHttpClient } from 'sparql-http-client'
import { SparqlTemplateResult } from '@tpluscode/rdf-string'

interface SparqlBuildOptions {
  base?: string
}

export interface SparqlQueryBuilder {
  build(options?: SparqlBuildOptions): string
  _getTemplateResult(): SparqlTemplateResult
}

export interface SparqlQueryExecutable<TResult> {
  execute(client: SparqlHttpClient, requestInit?: RequestInit): Promise<TResult>
}

export type SparqlQuery<T> = SparqlQueryBuilder & SparqlQueryExecutable<T>

export default function Builder<T extends SparqlQueryBuilder>(): Pick<SparqlQueryBuilder, 'build'> {
  return {
    build(this: SparqlQueryBuilder, { base }: SparqlBuildOptions = {}): string {
      return this._getTemplateResult().toString({
        base,
      })
    },
  }
}
