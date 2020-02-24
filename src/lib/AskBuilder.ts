import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { ask } from './execute'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type AskQuery = SparqlQueryBuilder<boolean>
& LimitOffsetBuilder<AskQuery> & {
  readonly patterns: SparqlTemplateResult
}

export const ASK = (strings: TemplateStringsArray, ...values: SparqlValue[]): AskQuery => ({
  ...ask,
  ...LIMIT(),
  patterns: sparql(strings, ...values),
  build(): string {
    return sparql`ASK { ${this.patterns} }
${this.limitOffsetClause()}`.toString()
  },
})
