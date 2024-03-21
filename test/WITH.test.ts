import { expect } from 'chai'
import RDF from '@zazuko/env'
import { DELETE, INSERT, WITH } from '../src/index.js'
import './sparql.js'

describe('WITH', () => {
  it('prepends WITH clause given as string', () => {
    // given
    const expected = 'WITH <http://test.graph/> DELETE { ?s ?p ?o } WHERE { ?s ?p ?o }'

    // when
    const actual = WITH('http://test.graph/', DELETE`?s ?p ?o`.WHERE`?s ?p ?o`).build()

    // then
    expect(actual).to.be.query(expected)
  })

  it('prepends WITH clause given as named node', () => {
    // given
    const expected = 'WITH <http://test.graph/> INSERT { ?s ?p ?o } WHERE { ?s ?p ?o }'

    // when
    const actual = WITH(RDF.namedNode('http://test.graph/'), INSERT`?s ?p ?o`.WHERE`?s ?p ?o`).build()

    // then
    expect(actual).to.be.query(expected)
  })
})
