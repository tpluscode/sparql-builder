import { SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQuery } from '..'
import { concat } from '../TemplateResult.js'

export interface PrologueBuilder {
  readonly prologueResult: SparqlTemplateResult | null
  prologue(strings: TemplateStringsArray, ...values: SparqlValue[]): this
}

export default <T extends SparqlQuery & PrologueBuilder>(): PrologueBuilder => ({
  prologueResult: null,
  prologue(strings: TemplateStringsArray, ...values): T {
    return {
      ...this,
      prologueResult: concat(this.prologueResult, strings, values, { newLineSeparator: false }),
    } as T
  },
})
