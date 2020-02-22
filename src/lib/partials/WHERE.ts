import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from '../index'

export interface WhereBuilder<T> {
  readonly patterns: SparqlTemplateResult | null
  whereClause(): SparqlTemplateResult
  WHERE(strings: TemplateStringsArray, ...values: SparqlValue[]): T
}

export default <T extends SparqlQueryBuilder<any> & WhereBuilder<T>>({ required }: { required: boolean }): WhereBuilder<T> => ({
  patterns: null,
  whereClause() {
    if (this.patterns) {
      return sparql`WHERE {
${this.patterns}
}`
    }

    if (required) {
      return sparql`WHERE {}`
    }

    return sparql``
  },
  WHERE(strings: TemplateStringsArray, ...values: SparqlValue[]): T {
    return {
      ...this,
      patterns: sparql(strings, ...values),
    } as T
  },
})
