import { SparqlHttpClient } from 'sparql-http-client'

export interface SparqlQueryBuilder<TResult> {
  build(): string
  execute(client: SparqlHttpClient, requestInit?: RequestInit): Promise<TResult>
}
