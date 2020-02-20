import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import { Builder } from './Builder'

export class DeleteInsertBuilder extends Builder<void> {
  private __patterns: string[] = []
  private __deleteGraph: string[] = []
  private __insertGraph: string[] = []

  protected _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit) {
    return client.updateQuery(query, options)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected async _getResult() {
  }

  public delete(...graph: string[]) {
    this.__deleteGraph = [...this.__deleteGraph, ...graph]

    return this
  }

  public insert(...graph: string[]) {
    this.__insertGraph = [...this.__insertGraph, ...graph]

    return this
  }

  public where(...patterns: string[]) {
    this.__patterns = [...this.__patterns, ...patterns]

    return this
  }

  protected _buildQueryInternal() {
    let where = this.__patterns
    if (where.length === 0) {
      where = this.__deleteGraph
    }

    const deleteClause = `DELETE {
      ${this.__deleteGraph.join('\n')}
    }`

    const insertClause = `INSERT {
      ${this.__insertGraph.join('\n')}
    }`

    return `
      ${this.__deleteGraph.length > 0 ? deleteClause : ''}
      ${this.__insertGraph.length > 0 ? insertClause : ''}
      WHERE {
        ${where.join('\n')}
      }
    `
  }
}
