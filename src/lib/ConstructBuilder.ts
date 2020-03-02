import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import Builder, { SparqlGraphQueryExecutable, SparqlQuery } from './index'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type ConstructQuery = SparqlQuery
& SparqlGraphQueryExecutable
& WhereBuilder<ConstructQuery>
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
  constructTemplate: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    return sparql`CONSTRUCT { ${this.constructTemplate} }
${this.whereClause()}
${this.limitOffsetClause()}`
  },
})
