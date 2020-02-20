import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import { Builder, SparqlBuilderInit } from './Builder'
import { Stream } from 'rdf-js'

export class DescribeBuilder extends Builder<Stream> {
  private __patterns: string[] = []
  private __variables: string[]

  public constructor(idOrVariable: string, additionalVariables: string[], options: SparqlBuilderInit = {}) {
    super(options)
    this.__variables = [idOrVariable, ...additionalVariables]
  }

  public _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit) {
    return client.constructQuery(query, options)
  }

  protected _getResult(response: any) {
    return response.quadStream()
  }

  public where(...patterns: string[]) {
    this.__patterns = [...this.__patterns, ...patterns]

    return this
  }

  protected _buildQueryInternal() {
    const variables = this.__variables.map(variable => variable.startsWith('?') ? variable : `<${variable}>`)

    return `DESCRIBE ${variables.join(' ')} {
      ${this.__patterns.join('\n')}
    }`
  }
}
