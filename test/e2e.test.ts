import ParsingClient from 'sparql-http-client/ParsingClient.js'
import StreamClient from 'sparql-http-client/StreamClient.js'
import { expect } from 'chai'
import $rdf from '@zazuko/env'
import { getStreamAsArray } from 'get-stream'
import { ASK, CONSTRUCT, SELECT } from '../src/index.js'
import './sparql.js'

describe('ParsingClient', function () {
  this.timeout(10000)

  describe('ASK', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await ASK`?s ?p ?o`.execute(client)

      // then
      expect(result).to.be.ok
    })
  })

  describe('CONSTRUCT', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await CONSTRUCT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client)

      // then
      expect(result.size).to.eq(1)
    })
  })

  describe('SELECT', () => {
    it('returns result', async () => {
      // given
      const client = new ParsingClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await SELECT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client)

      // then
      expect(result.length).to.eq(1)
    })
  })
})

describe('StreamClient', function () {
  this.timeout(10000)

  describe('ASK', () => {
    it('returns result', async () => {
      // given
      const client = new StreamClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const result = await ASK`?s ?p ?o`.execute(client)

      // then
      expect(result).to.be.ok
    })
  })

  describe('CONSTRUCT', () => {
    it('returns result', async () => {
      // given
      const client = new StreamClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const stream = CONSTRUCT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client)
      const result = await $rdf.dataset().import(stream)

      // then
      expect(result.size).to.eq(1)
    })
  })

  describe('SELECT', () => {
    it('returns result', async () => {
      // given
      const client = new StreamClient({
        factory: $rdf,
        endpointUrl: 'http://dbpedia.org/sparql',
      })

      // when
      const stream = SELECT`?s ?p ?o`
        .WHERE`?s ?p ?o`
        .LIMIT(1).execute(client)
      const result = await getStreamAsArray(stream)

      // then
      expect(result.length).to.eq(1)
    })
  })
})
