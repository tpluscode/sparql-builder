import { DELETE, INSERT, WITH } from '../src'

describe('WITH', () => {
  it('prepends WITH clause given as string', () => {
    // given
    const expected = 'WITH <http://test.graph/> DELETE { ?s ?p ?o } WHERE { ?s ?p ?o }'

    // when
    const actual = WITH('http://test.graph/', DELETE`?s ?p ?o`.WHERE`?s ?p ?o`).build()

    // then
    expect(actual).toMatchQuery(expected)
  })
  it('prepends WITH clause given as string', () => {
    // given
    const expected = 'WITH <http://test.graph/> INSERT { ?s ?p ?o } WHERE { ?s ?p ?o }'

    // when
    const actual = WITH('http://test.graph/', INSERT`?s ?p ?o`.WHERE`?s ?p ?o`).build()

    // then
    expect(actual).toMatchQuery(expected)
  })
})
