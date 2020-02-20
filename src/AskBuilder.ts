import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import { Builder } from './Builder'

export class AskBuilder extends Builder<boolean> {
  private __patterns: string[] = []

  protected _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit) {
    return client.selectQuery(query, options)
  }

  protected async _getResult(response: SparqlHttp.SelectResponse & Response) {
    const json = await response.json()
    return json.boolean
  }

  public where(...patterns: string[]) {
    this.__patterns = [...this.__patterns, ...patterns]

    return this
  }

  protected _buildQueryInternal() {
    return `ASK {
      ${this.__patterns.join('\n')}
    }`
  }
}
