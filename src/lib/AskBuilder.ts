import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import Builder, { SparqlQuery, SparqlAskExecutable } from './index'
import { ask } from './execute'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type AskQuery = SparqlQuery
& SparqlAskExecutable
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
