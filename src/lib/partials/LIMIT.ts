import { SparqlQueryBuilder } from '../index'

export interface LimitOffsetBuilder<T> {
  offset: number | null
  limit: number | null
  LIMIT(limit: number): T
  OFFSET(offset: number): T
  limitOffsetClause(): string
}

export default <T extends SparqlQueryBuilder<any> & LimitOffsetBuilder<T>>(): LimitOffsetBuilder<T> => ({
  limit: null,
  offset: null,
  limitOffsetClause() {
    let clause = ''
    if (this.limit != null) {
      clause += `LIMIT ${this.limit} `
    }

    if (this.offset != null) {
      clause += `OFFSET ${this.offset}`
    }

    return clause
  },
  LIMIT(limit: number): T {
    return {
      ...this,
      limit,
    } as T
  },
  OFFSET(offset: number): T {
    return {
      ...this,
      offset,
    } as T
  },
})
