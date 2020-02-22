import { SparqlHttpClient } from 'sparql-http-client'
import debug from 'debug'
import { Stream, Term } from 'rdf-js'
import { SparqlQueryBuilder } from './index'

const logQuery = debug('SPARQL')
const logQueryError = logQuery.extend('error')

function checkResponse(query: string) {
  return function assertSuccessfulResponse(response: Response): Response {
    if (response.ok) {
      return response
    }

    logQueryError('Failed query %s', query)
    throw new Error(response.statusText)
  }
}

export const update: Pick<SparqlQueryBuilder<void>, 'execute'> = {
  async execute(this: SparqlQueryBuilder<void>, client: SparqlHttpClient, requestInit: RequestInit): Promise<void> {
    await client.updateQuery(this.build(), requestInit).then(checkResponse(this.build()))
  },
}

export const ask: Pick<SparqlQueryBuilder<boolean>, 'execute'> = {
  async execute(this: SparqlQueryBuilder<boolean>, client: SparqlHttpClient, requestInit: RequestInit): Promise<boolean> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.boolean
  },
}

export const select: Pick<SparqlQueryBuilder<readonly Record<string, Term>[]>, 'execute'> = {
  async execute(this: SparqlQueryBuilder<readonly Record<string, Term>[]>, client: SparqlHttpClient, requestInit: RequestInit): Promise<readonly Record<string, Term>[]> {
    const response = await client.selectQuery(this.build(), requestInit).then(checkResponse(this.build()))
    const json = await response.json()
    return json.results.bindings
  },
}

export const graph: Pick<SparqlQueryBuilder<Stream>, 'execute'> = {
  async execute(this: SparqlQueryBuilder<Stream>, client: SparqlHttpClient<Response>, requestInit: RequestInit): Promise<Stream> {
    const response = await client.constructQuery(this.build(), requestInit).then(checkResponse(this.build())) as any
    return response.quadStream()
  },
}
