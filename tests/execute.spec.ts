import { Term, Stream } from 'rdf-js'
import { SparqlHttpClient } from 'sparql-http-client'
import { ask, graph, select, update } from '../src/lib/execute'
import { sparqlClient } from './_mocks'
import { SparqlQuery } from '../src/lib'

const builder: Omit<SparqlQuery<any>, '_getTemplateResult'> = {
  build(): string {
    return ''
  },
  execute: jest.fn(),
}

describe('execute', () => {
  describe('select', () => {
    let execute: (client: SparqlHttpClient, requestInit: RequestInit) => Promise<readonly Record<string, Term>[]>

    beforeEach(() => {
      execute = select.execute.bind(builder)
    })

    it('passes request init to sparql client', () => {
      // given
      const client = sparqlClient()

      // when
      execute(client, {
        headers: {
          authentication: 'Bearer foobar',
        },
      })

      // then
      expect(client.selectQuery).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('graph', () => {
    let execute: (client: SparqlHttpClient, requestInit: RequestInit) => Promise<Stream>

    beforeEach(() => {
      execute = graph.execute.bind(builder)
    })

    it('passes request init to sparql client', () => {
      // given
      const client = sparqlClient()

      // when
      execute(client, {
        headers: {
          authentication: 'Bearer foobar',
        },
      })

      // then
      expect(client.constructQuery).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('update', () => {
    let execute: (client: SparqlHttpClient, requestInit: RequestInit) => Promise<void>

    beforeEach(() => {
      execute = update.execute.bind(builder)
    })

    it('passes request init to sparql client', () => {
      // given
      const client = sparqlClient()

      // when
      execute(client, {
        headers: {
          authentication: 'Bearer foobar',
        },
      })

      // then
      expect(client.updateQuery).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })

  describe('ask', () => {
    let execute: (client: SparqlHttpClient, requestInit: RequestInit) => Promise<boolean>

    beforeEach(() => {
      execute = ask.execute.bind(builder)
    })

    it('passes request init to sparql client', () => {
      // given
      const client = sparqlClient()

      // when
      execute(client, {
        headers: {
          authentication: 'Bearer foobar',
        },
      })

      // then
      expect(client.selectQuery).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
})
