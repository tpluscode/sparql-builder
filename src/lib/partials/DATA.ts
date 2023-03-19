import { Term } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQuery } from '../index.js'
import { concat } from '../TemplateResult.js'

export interface QuadDataBuilder<T, TTerm extends Term = Term> {
  readonly quadData: SparqlTemplateResult
  DATA(strings: TemplateStringsArray, ...values: SparqlValue<TTerm>[]): T
}

// eslint-disable-next-line no-use-before-define
export default <T extends SparqlQuery & QuadDataBuilder<T, TTerm>, TTerm extends Term = Term>(strings: TemplateStringsArray, values: SparqlValue<TTerm>[]): QuadDataBuilder<T, TTerm> => ({
  quadData: sparql(strings, ...values),
  DATA(strings: TemplateStringsArray, ...values): T {
    return {
      ...this,
      quadData: concat(this.quadData, strings, values),
    } as T
  },
})
