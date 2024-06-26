import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQuery } from '../index.js'
import { concat } from '../TemplateResult.js'

export interface HavingBuilder<T> {
  readonly havings: SparqlTemplateResult | null
  havingClause(): SparqlTemplateResult
  HAVING(strings: TemplateStringsArray, ...values: SparqlValue[]): T
}

export default <T extends SparqlQuery & HavingBuilder<T>>(): HavingBuilder<T> => ({
  havings: null,
  havingClause() {
    if (this.havings) {
      return sparql`HAVING ${this.havings}`
    }

    return sparql``
  },
  HAVING(strings: TemplateStringsArray, ...values: SparqlValue[]): T {
    return {
      ...this,
      havings: concat(this.havings, strings, values, { wrapTemplate: true }),
    } as T
  },
})
