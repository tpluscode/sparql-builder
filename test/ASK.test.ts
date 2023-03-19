import namespace from '@rdfjs/namespace'
import RDF from '@rdfjs/data-model'
import { expect } from 'chai'
import { ASK } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('ASK', () => {
  it('creates expected query', () => {
    // given
    const expected = `ASK {
      ?s ?p ?o .
      ?x ?y ?z .
    }`

    // when
    const query = ASK`?s ?p ?o . ?x ?y ?z .`.build()

    // then
    expect(query).to.be.query(expected)
  })

  it('executes as ask', async () => {
    // given
    const client = sparqlClient()

    // when
    await ASK``.execute(client)

    // then
    expect(client.ask).to.have.been.called
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const query = ASK`?s ?p ?o .`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(query).to.matchSnapshot(this)
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = `ASK {
      ?s ?p ?o .
    } LIMIT 10 OFFSET 20`

    // when
    const query = ASK`?s ?p ?o .`.LIMIT(10).OFFSET(20).build()

    // then
    expect(query).to.be.query(expected)
  })

  it('supports FROM (NAMED)', () => {
    // given
    const expected = `ASK 
      FROM <http://example.com/foo>
      FROM NAMED <http://example.com/bar>
      {
        ?s ?p ?o .
      }`

    // when
    const query = ASK`?s ?p ?o .`
      .FROM(RDF.namedNode('http://example.com/foo'))
      .FROM().NAMED(RDF.namedNode('http://example.com/bar'))
      .build()

    // then
    expect(query).to.be.query(expected)
  })

  it('can be constructed with a base', () => {
    // given
    const ns = namespace('http://example.com/')
    const expected = `BASE <http://example.com/>

    ASK {
      <person> a <Person>
    }`

    // when
    const query = ASK`${ns.person} a ${ns.Person} .`.build({
      base: 'http://example.com/',
    })

    // then
    expect(query).to.be.query(expected)
  })
})
