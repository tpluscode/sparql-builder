import { NamedNode } from 'rdf-js'
import SparqlHttp, { QueryRequestInit } from 'sparql-http-client'
import debug from 'debug'
import authHeader from './authentication'

const logQuery = debug('SPARQL')
const logQueryError = logQuery.extend('error')

function buildPrefixes(prefixes: Record<string, (term: string) => NamedNode>) {
  return Object.entries(prefixes)
    .map(p => `PREFIX ${p[0]}: <${p[1]('').value}>`).join('\n')
}

export interface SparqlBuilderInit {
  baseUri?: string
  username?: string
  password?: string
}

export abstract class Builder<T> {
  private readonly __baseUri: string | undefined
  private readonly __username: string | undefined
  private readonly __password: string | undefined
  private __prefixes = {}
  protected __defaultGraph?: string

  public constructor({ baseUri, username, password }: SparqlBuilderInit = {}) {
    this.__baseUri = baseUri
    this.__username = username
    this.__password = password
  }

  public prefixes(value: Record<string, (term: string) => NamedNode>) {
    this.__prefixes = value

    return this
  }

  public from(defaultGraph: string) {
    this.__defaultGraph = defaultGraph
    return this
  }

  public build() {
    const base = this.__baseUri ? `BASE <${this.__baseUri}>` : ''

    return `${base}
${buildPrefixes(this.__prefixes)}

${this._buildQueryInternal()}`
  }

  public execute(client: SparqlHttp): Promise<T> {
    const query = this.build().trim()

    logQuery('executing %s', query)
    let requestInit = {}
    if (this.__username && this.__password) {
      requestInit = {
        headers: {
          authorization: authHeader(this.__username, this.__password),
        },
      }
    }

    return this._executeInternal(client, query, requestInit)
      .then(this.__checkResponse(query))
      .then(this._getResult)
  }

  protected abstract _executeInternal(client: SparqlHttp, query: string, options: QueryRequestInit): Promise<Response>

  protected abstract _getResult(response: Response): Promise<T>

  protected abstract _buildQueryInternal(): string

  private __checkResponse(query: string) {
    return function assertSuccessfulResponse(response: Response): Response {
      if (response.ok) {
        return response
      }

      logQueryError('Failed query %s', query)
      throw new Error(response.statusText)
    }
  }
}
