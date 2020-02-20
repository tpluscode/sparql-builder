import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import { Builder } from './Builder'

export class InsertDataBuilder extends Builder<void> {
  private __data: string[] = []

  protected _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit) {
    return client.updateQuery(query, options)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected async _getResult() {
  }

  public graph(...graph: string[]) {
    this.__data = [...this.__data, ...graph]

    return this
  }

  protected _buildQueryInternal() {
    return `INSERT DATA {
      ${this.__data.join('\n')}
    }`
  }
}
