import RDF from '@zazuko/env'
import chai, { expect } from 'chai'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'
import { SELECT } from '../src/index.js'
import { sparqlClient } from './_mocks.js'
import './sparql.js'

describe('SELECT', () => {
  chai.use(jestSnapshotPlugin())

  it('executes as select', () => {
    // given
    const client = sparqlClient()

    // when
    SELECT``.execute(client)

    // then
    expect(client.query.select).to.have.been.called
  })

  it('creates a simple select/where', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`?s ?p ?o`.WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can have additional prologue', function () {
    // given
    const base = RDF.namedNode('http://foo.bar/baz')

    // when
    const actual = SELECT`?s ?p ?o`
      .WHERE`?s ?p ?o`
      .prologue`#pragma join.hash off`
      .prologue`BASE ${base}`
      .build()

    // then
    expect(actual).toMatchSnapshot()
  })

  it('combines multiple WHERE clauses', () => {
    // given
    const expected = 'SELECT * WHERE { ?s ?p ?o. ?a ?b ?c }'

    // when
    const actual = SELECT`*`
      .WHERE`?s ?p ?o .`
      .WHERE`?a ?b ?c .`
      .build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('adds FROM when default graph set', () => {
    // given
    const expected = 'SELECT * FROM <urn:foo:bar> WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`*`.FROM(RDF.namedNode('urn:foo:bar')).WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('supports multiple FROM', () => {
    // given
    const expected = `SELECT * 
      FROM <urn:foo:bar>
      FROM <urn:foo:baz>
      WHERE { ?s ?p ?o }`

    // when
    const actual = SELECT`*`
      .FROM(RDF.namedNode('urn:foo:bar'))
      .FROM(RDF.namedNode('urn:foo:baz'))
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('allows mixing FROM and FROM NAMED', () => {
    // given
    const expected = `SELECT * 
      FROM <urn:foo:bar>
      FROM NAMED <urn:foo:baz>
      WHERE { ?s ?p ?o }`

    // when
    const actual = SELECT`*`
      .FROM(RDF.namedNode('urn:foo:bar'))
      .FROM().NAMED(RDF.namedNode('urn:foo:baz'))
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('does not add FROM when graph is defaultGraph', () => {
    // given
    const expected = 'SELECT * WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`*`.FROM(RDF.defaultGraph()).WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('resets default graph when FROM default is called', () => {
    // given
    const expected = 'SELECT * WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`*`
      .FROM(RDF.namedNode('urn:foo:bar'))
      .FROM(RDF.defaultGraph())
      .WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('supports LIMIT/OFFSET', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 15 OFFSET 40'

    // when
    const actual = SELECT`?s ?p ?o`.WHERE`?s ?p ?o`.LIMIT(15).OFFSET(40).build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be constructed with a base', () => {
    // given
    const ns = RDF.namespace('http://example.com/')
    const expected = `
     BASE <http://example.com/>
     
     SELECT *
     FROM <graph>
     WHERE {
      <person> a <Person> 
     }`

    // when
    const actual = SELECT`*`
      .FROM(ns.graph)
      .WHERE`${ns.person} a ${ns.Person}`
      .build({
        base: 'http://example.com/',
      })

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be ordered by variable', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } ORDER BY ?s'

    // when
    const s = RDF.variable('s')
    const actual = SELECT`${s} ?p ?o`
      .WHERE`${s} ?p ?o`
      .ORDER().BY(s)
      .build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be ordered by desc(?variable)', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } ORDER BY desc(?s)'

    // when
    const s = RDF.variable('s')
    const actual = SELECT`${s} ?p ?o`
      .WHERE`${s} ?p ?o`
      .ORDER().BY(s, true)
      .build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be ordered by multiple variables', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } ORDER BY desc(?s) ?o'

    // when
    const s = RDF.variable('s')
    const o = RDF.variable('o')
    const actual = SELECT`${s} ?p ${o}`
      .WHERE`${s} ?p ${o}`
      .ORDER().BY(s, true).THEN.BY(o)
      .build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be ordered and limited, when calls are reversed', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 20'

    // when
    const s = RDF.variable('s')
    const actual = SELECT`${s} ?p ?o`
      .WHERE`${s} ?p ?o`
      .LIMIT(20)
      .ORDER().BY(s)
      .build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can be made distinct at any time', () => {
    // given
    const expected = 'SELECT DISTINCT ?s WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`?s`.WHERE`?s ?p ?o`.DISTINCT().build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('can add more variables', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { ?s ?p ?o }'

    // when
    const actual = SELECT`?s`.AND`?p`.AND`?o`.WHERE`?s ?p ?o`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('wraps when interpolated in a template', () => {
    // given
    const expected = 'SELECT ?s ?p ?o WHERE { { SELECT ?s ?p ?o WHERE { ?s ?p ?o } } }'

    // when
    const subquery = SELECT`?s ?p ?o`.WHERE`?s ?p ?o`
    const actual = SELECT`?s ?p ?o`.WHERE`${subquery}`.build()

    // then
    expect(actual).to.be.query(expected)
  })

  describe('ALL', () => {
    it('is alias for SELECT *', () => {
      // given
      const expected = 'SELECT * WHERE { ?s ?p ?o } '

      // when
      const actual = SELECT.ALL
        .WHERE`?s ?p ?o`
        .build()

      // then
      expect(actual).to.be.query(expected)
    })
  })

  describe('DISTINCT', () => {
    it('creates correct SPARQL', () => {
      // given
      const expected = 'SELECT DISTINCT * WHERE { ?s ?p ?o }'

      // when
      const actual = SELECT.DISTINCT`*`.WHERE`?s ?p ?o`.build()

      // then
      expect(actual).to.be.query(expected)
    })
  })

  describe('REDUCED', () => {
    it('creates correct SPARQL', () => {
      // given
      const expected = 'SELECT REDUCED * WHERE { ?s ?p ?o }'

      // when
      const actual = SELECT.REDUCED`*`.WHERE`?s ?p ?o`.build()

      // then
      expect(actual).to.be.query(expected)
    })
  })

  describe('GROUP BY', () => {
    it('can be grouped by variable', () => {
      // given
      const expected = 'SELECT (SUM(?s) as ?sum) WHERE { ?s ?p ?o } GROUP BY (?s)'

      // when
      const s = RDF.variable('s')
      const actual = SELECT`(SUM(${s}) as ?sum)`
        .WHERE`${s} ?p ?o`
        .GROUP().BY(s)
        .build()

      // then
      expect(actual).to.be.query(expected)
    })

    it('can be grouped by variable name (string)', () => {
      // given
      const expected = 'SELECT (SUM(?s) as ?sum) WHERE { ?s ?p ?o } GROUP BY (?s)'

      // when
      const s = RDF.variable('s')
      const actual = SELECT`(SUM(${s}) as ?sum)`
        .WHERE`${s} ?p ?o`
        .GROUP().BY('s')
        .build()

      // then
      expect(actual).to.be.query(expected)
    })

    it('can be grouped by variable with binding keyword as variable name', () => {
      // given
      const expected = 'SELECT (SUM(?x) as ?sum) WHERE { ?s ?p ?o } GROUP BY (?s as ?x)'

      // when
      const s = RDF.variable('s')
      const actual = SELECT`(SUM(?x) as ?sum)`
        .WHERE`${s} ?p ?o`
        .GROUP().BY(s).AS('x')
        .build()

      // then
      expect(actual).to.be.query(expected)
    })

    it('can be grouped by expression with binding keyword as variable', () => {
      // given
      const expected = 'SELECT (SUM(?x) as ?sum) WHERE { ?s ?p ?o } GROUP BY (?s + ?p as ?x)'

      // when
      const s = RDF.variable('s')
      const x = RDF.variable('x')
      const actual = SELECT`(SUM(${x}) as ?sum)`
        .WHERE`${s} ?p ?o`
        .GROUP().BY`${s} + ?p`.AS(x)
        .build()

      // then
      expect(actual).to.be.query(expected)
    })

    it('can be grouped multiple times', () => {
      // given
      const expected = 'SELECT (SUM(?s) as ?sum) WHERE { ?s ?p ?o } GROUP BY (?s) (?x as ?z)'

      // when
      const s = RDF.variable('s')
      const x = RDF.variable('x')
      const actual = SELECT`(SUM(${s}) as ?sum)`
        .WHERE`${s} ?p ?o`
        .GROUP().BY(s).THEN.BY(x).AS('z')
        .build()

      // then
      expect(actual).to.be.query(expected)
    })
  })

  describe('HAVING', () => {
    it('can build multiple HAVING clauses', () => {
      // given
      const expected = 'SELECT * WHERE { ?s ?p ?o } HAVING (AVG(?s) > 10) (SUM(?p) = 0)'

      // when
      const s = RDF.variable('s')
      const actual = SELECT.ALL
        .WHERE`?s ?p ?o`
        .HAVING`AVG(${s}) > 10`
        .HAVING`SUM(?p) = 0`
        .build()

      // then
      expect(actual).to.be.query(expected)
    })
  })
})
