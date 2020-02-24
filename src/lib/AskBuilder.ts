import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import Builder, { SparqlQuery } from './index'
import { ask } from './execute'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type AskQuery = SparqlQuery<boolean>
& LimitOffsetBuilder<AskQuery> & {
  readonly patterns: SparqlTemplateResult
}

export const ASK = (strings: TemplateStringsArray, ...values: SparqlValue[]): AskQuery => ({
  ...Builder(),
  ...ask,
  ...LIMIT(),
  patterns: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    return sparql`ASK { ${this.patterns} }
${this.limitOffsetClause()}`
  },
})
