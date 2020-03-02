import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQuery } from '../index'
import { concat } from '../TemplateResult'

export interface InsertBuilder<T> {
  readonly insertPatterns: SparqlTemplateResult | null
  insertClause(): SparqlTemplateResult
  INSERT(strings: TemplateStringsArray, ...values: SparqlValue[]): T
}

export default <T extends SparqlQuery & InsertBuilder<T>>(insertPatterns: SparqlTemplateResult | null = null): InsertBuilder<T> => ({
  insertPatterns,
  insertClause(): SparqlTemplateResult {
    return sparql`INSERT{
  ${this.insertPatterns}
}`
  },
  INSERT(strings: TemplateStringsArray, ...values: SparqlValue[]) {
    return {
      ...this,
      insertPatterns: concat(this.insertPatterns, strings, values),
    } as T
  },
})
