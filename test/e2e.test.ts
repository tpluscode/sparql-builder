import ParsingClient from 'sparql-http-client/ParsingClient.js'
import { expect } from 'chai'
import { ASK, CONSTRUCT, SELECT } from '../src/index.js'
import './sparql.js'

describe('ParsingClient', function () {
  this.timeout(10000)

  describe('ASK', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await ASK`?s ?p ?o`.execute(client.query)

      // then
      expect(result).to.be.ok
    })
  })

  describe('CONSTRUCT', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await CONSTRUCT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client.query)

      // then
      expect(result.length).to.eq(1)
    })
  })

  describe('SELECT', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await SELECT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client.query)

      // then
      expect(result.length).to.eq(1)
    })
  })
})
