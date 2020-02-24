import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from '../index'
import { concat } from '../TemplateResult'
import { Term } from 'rdf-js'

export interface QuadDataBuilder<T, TTerm extends Term = Term> {
  readonly quadData: SparqlTemplateResult
  DATA(strings: TemplateStringsArray, ...values: SparqlValue<TTerm>[]): T
}

export default <T extends SparqlQueryBuilder & QuadDataBuilder<T, TTerm>, TTerm extends Term = Term>(strings: TemplateStringsArray, values: SparqlValue<TTerm>[]): QuadDataBuilder<T, TTerm> => ({
  quadData: sparql(strings, ...values),
  DATA(strings: TemplateStringsArray, ...values): T {
    return {
      ...this,
      quadData: concat(this.quadData, strings, values),
    } as T
  },
})
