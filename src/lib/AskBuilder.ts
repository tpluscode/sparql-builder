import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { ask } from './execute'

interface AskQuery extends SparqlQueryBuilder<boolean> {
  readonly patterns: SparqlTemplateResult
}

export const ASK = (strings: TemplateStringsArray, ...values: SparqlValue[]): AskQuery => ({
  ...ask,
  patterns: sparql(strings, ...values),
  build(): string {
    return sparql`ASK { ${this.patterns} }`.toString()
  },
})
