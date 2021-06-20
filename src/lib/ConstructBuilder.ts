import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'
import FROM, { FromBuilder } from './partials/FROM'
import Builder, { SparqlGraphQueryExecutable, SparqlQuery } from './index'

type ConstructQuery = SparqlQuery
& SparqlGraphQueryExecutable
& WhereBuilder<ConstructQuery>
& FromBuilder<ConstructQuery>
& LimitOffsetBuilder<ConstructQuery> & {
  readonly constructTemplate: SparqlTemplateResult
}

export const CONSTRUCT = (strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery => ({
  ...Builder(),
  ...graph,
  ...WHERE<ConstructQuery>({
    required: true,
  }),
  ...LIMIT(),
  ...FROM(),
  constructTemplate: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    return sparql`CONSTRUCT { ${this.constructTemplate} }
${this.fromClause()}
${this.whereClause()}
${this.limitOffsetClause()}`
  },
})
