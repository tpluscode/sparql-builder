import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { ask } from './execute'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'
import FROM, { FromBuilder } from './partials/FROM'
import Builder, { SparqlQuery, SparqlAskExecutable } from './index'

type AskQuery = SparqlQuery
& SparqlAskExecutable
& FromBuilder<AskQuery>
& LimitOffsetBuilder<AskQuery> & {
  readonly patterns: SparqlTemplateResult
}

export const ASK = (strings: TemplateStringsArray, ...values: SparqlValue[]): AskQuery => ({
  ...Builder(),
  ...ask,
  ...LIMIT(),
  ...FROM(),
  patterns: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    return sparql`ASK ${this.fromClause()} { ${this.patterns} }
${this.limitOffsetClause()}`
  },
})
