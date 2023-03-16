import namespace from '@rdfjs/namespace'
import { dbo, foaf, schema, skos } from '@tpluscode/rdf-ns-builders'
import * as RDF from '@rdfjs/data-model'
import { namedNode } from '@rdfjs/data-model'
import { CONSTRUCT, SELECT } from '../src'
import { sparqlClient } from './_mocks'

describe('CONSTRUCT', () => {
  it('executes as construct', () => {
    // given
    const client = sparqlClient()

    // when
    CONSTRUCT``.execute(client)

    // then
    expect(client.construct).toHaveBeenCalled()
  })

  it('can have additional prologue', () => {
    // given
    const base = namedNode('http://foo.bar/baz')

    // when
    const query = CONSTRUCT`?s ?p ?o .`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(query).toMatchSnapshot()
  })

  it('generates empty WHERE clause by default', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT { <http://example.com/me> a schema:Person } WHERE {}`

    // when
    const actual = CONSTRUCT`<http://example.com/me> a ${schema.Person}`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('support shorthand syntax', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT WHERE { ?person a schema:Person }`

    // when
    const actual = CONSTRUCT.WHERE`?person a ${schema.Person}`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('correctly interpolate shorthand syntax', () => {
    // given
    const root = RDF.namedNode('https://example.com/')
    const expected = `PREFIX skos: <${skos().value}>
    CONSTRUCT WHERE { 
      <https://example.com/> skos:narrower ?narrower .
      ?narrower skos:prefLabel ?label . 
    }`

    // when
    const actual = CONSTRUCT.WHERE`
      ${root} ${skos.narrower} ?narrower .
      ?narrower ${skos.prefLabel} ?label .
    `.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('support FROM in shorthand syntax', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT FROM <http://example.com/graph> WHERE { ?person a schema:Person }`

    // when
    const actual = CONSTRUCT.WHERE`?person a ${schema.Person}`
      .FROM(RDF.namedNode('http://example.com/graph')).build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT { <http://example.com/me> a schema:Person } WHERE {}
    LIMIT 5 OFFSET 305`

    // when
    const actual = CONSTRUCT`<http://example.com/me> a ${schema.Person}`.LIMIT(5).OFFSET(305).build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('can be constructed with a base', () => {
    // given
    const ns = namespace('http://example.com/')
    const expected = `BASE <http://example.com/>

    CONSTRUCT {
      <person> a <Person>
    } WHERE {}`

    // when
    const actual = CONSTRUCT`${ns.person} a ${ns.Person}`.build({
      base: 'http://example.com/',
    })

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('can be combined with another query to create a subquery', () => {
    // given
    const person = RDF.variable('person')
    const selectPeopleBornInBerlin = SELECT`${person}`
      .WHERE`${person} ${dbo.birthPlace} <http://dbpedia.org/resource/Berlin>`
      .LIMIT(100)
    const expected = `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

CONSTRUCT { ?person ?p ?o }
WHERE {

    VALUES ?p { dbo:birthDate dbo:deathDate foaf:name }
    ?person ?p ?o .

    {
        SELECT ?person
        
        WHERE {
            ?person dbo:birthPlace <http://dbpedia.org/resource/Berlin>
        }
        LIMIT 100 
    }
}`

    // when
    const construct = CONSTRUCT`${person} ?p ?o`
      .WHERE`
        VALUES ?p { ${dbo.birthDate} ${dbo.deathDate} ${foaf.name} }
        ${person} ?p ?o .

        ${selectPeopleBornInBerlin}
    `.build()

    // then
    expect(construct).toMatchQuery(expected)
  })

  it('adds FROM when default graph set', () => {
    // given
    const expected = 'CONSTRUCT { ?s ?p ?o } FROM <urn:foo:bar> WHERE { ?s ?p ?o }'

    // when
    const actual = CONSTRUCT`?s ?p ?o`.FROM(RDF.namedNode('urn:foo:bar')).WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('supports multiple FROM NAMED', () => {
    // given
    const expected = `CONSTRUCT { ?s ?p ?o }
      FROM NAMED <urn:foo:bar>
      FROM NAMED <urn:foo:baz>
      WHERE { ?s ?p ?o }`

    // when
    const actual = CONSTRUCT`?s ?p ?o`
      .FROM().NAMED(RDF.namedNode('urn:foo:bar'))
      .FROM().NAMED(RDF.namedNode('urn:foo:baz'))
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('supports multiple FROM', () => {
    // given
    const expected = `CONSTRUCT { ?s ?p ?o }
      FROM <urn:foo:bar>
      FROM <urn:foo:baz>
      WHERE { ?s ?p ?o }`

    // when
    const actual = CONSTRUCT`?s ?p ?o`
      .FROM(RDF.namedNode('urn:foo:bar'))
      .FROM(RDF.namedNode('urn:foo:baz'))
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })

  it('allows mixing FROM and FROM NAMED', () => {
    // given
    const expected = `CONSTRUCT { ?s ?p ?o }
      FROM <urn:foo:bar>
      FROM NAMED <urn:foo:baz>
      WHERE { ?s ?p ?o }`

    // when
    const actual = CONSTRUCT`?s ?p ?o`
      .FROM(RDF.namedNode('urn:foo:bar'))
      .FROM().NAMED(RDF.namedNode('urn:foo:baz'))
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
