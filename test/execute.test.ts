import { Term } from '@rdfjs/types'
import type { Client } from 'sparql-http-client'
import { expect } from 'chai'
import { ask, graph, select, update } from '../src/lib/execute.js'
import { SparqlQuery } from '../src/lib/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

const builder: Pick<SparqlQuery, 'build'> = {
  build(): string {
    return ''
  },
}

describe('execute', () => {
  describe('select', () => {
    let execute: (client: Client, requestInit: RequestInit) => Promise<readonly Record<string, Term>[]>

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
      expect(client.query.select).to.have.been.calledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('graph', () => {
    let execute: (client: Client, requestInit: RequestInit) => Promise<Response>

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
      expect(client.query.construct).to.have.been.calledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
  describe('update', () => {
    let execute: (client: Client, requestInit: RequestInit) => Promise<void>

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
      expect(client.query.update).to.have.been.calledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })

  describe('ask', () => {
    let execute: (client: Client, requestInit: RequestInit) => Promise<boolean>

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
      expect(client.query.ask).to.have.been.calledWith('', {
        headers: {
          authentication: 'Bearer foobar',
        },
      })
    })
  })
})
