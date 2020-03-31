import namespace from '@rdfjs/namespace'
import { dbo, foaf, schema } from '@tpluscode/rdf-ns-builders'
import { variable } from '@rdfjs/data-model'
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

  it('generates empty WHERE clause by default', () => {
    // given
    const expected = `PREFIX schema: <http://schema.org/>
    CONSTRUCT { <http://example.com/me> a schema:Person } WHERE {}`

    // when
    const actual = CONSTRUCT`<http://example.com/me> a ${schema.Person}`.build()

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
    const person = variable('person')
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

        {
          ${selectPeopleBornInBerlin}
        }
    `.build()

    // then
    expect(construct).toMatchQuery(expected)
  })
})
