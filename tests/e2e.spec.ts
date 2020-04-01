import ParsingClient from 'sparql-http-client/ParsingClient'
import {ASK, CONSTRUCT, SELECT} from '../src'

describe('ParsingClient', () => {
  describe('ASK', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await ASK`?s ?p ?o`.execute(client.query)

      // then
      expect(result).toBeDefined()
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
      expect(result.length).toEqual(1)
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
      expect(result.length).toEqual(1)
    })
  })
})
