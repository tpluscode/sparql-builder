import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import { RdfFetchResponse } from '@rdfjs/fetch-lite'
import { Stream } from 'rdf-js'
import { Builder } from './Builder'

export class ConstructBuilder extends Builder<Stream> {
  private __constructGraph: string[] = []
  private __patterns: string[] = []

  public graph(...graph: string[]) {
    this.__constructGraph = [...this.__constructGraph, ...graph]

    return this
  }

  public where(...patterns: string[]) {
    this.__patterns = [...this.__patterns, ...patterns]

    return this
  }

  protected _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit) {
    return client.constructQuery(query, options)
  }

  protected async _getResult(response: RdfFetchResponse) {
    return response.quadStream()
  }

  protected _buildQueryInternal() {
    return `CONSTRUCT {
       ${this.__constructGraph.join('\n')}
    }
    WHERE {
       ${this.__patterns.join('\n')}
    }`
  }
}
