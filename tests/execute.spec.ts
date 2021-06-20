import { Term } from 'rdf-js'
import { SelectQuery, AskQuery, ConstructQuery, UpdateQuery } from 'sparql-http-client'
import { ask, graph, select, update } from '../src/lib/execute'
import { SparqlQuery } from '../src/lib'
import { sparqlClient } from './_mocks'

const builder: Omit<SparqlQuery, '_getTemplateResult'> = {
  build(): string {
    return ''
  },
}

describe('execute', () => {
  describe('select', () => {
    let execute: (client: SelectQuery<any>, requestInit: RequestInit) => Promise<readonly Record<string, Term>[]>

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
      expect(client.select).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('graph', () => {
    let execute: (client: ConstructQuery<any>, requestInit: RequestInit) => Promise<Response>

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
      expect(client.construct).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('update', () => {
    let execute: (client: UpdateQuery<any>, requestInit: RequestInit) => Promise<void>

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
      expect(client.update).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })

  describe('ask', () => {
    let execute: (client: AskQuery<any>, requestInit: RequestInit) => Promise<boolean>

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
      expect(client.ask).toHaveBeenCalledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
})
