import { NamedNode, Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { graph } from './execute.js'
import WHERE, { WhereBuilder } from './partials/WHERE.js'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT.js'
import FROM, { FromBuilder } from './partials/FROM.js'
import ORDER, { OrderBuilder } from './partials/ORDER.js'
import Builder, { SparqlGraphQueryExecutable, SparqlQuery } from './index.js'

export type DescribeQuery = SparqlQuery
& SparqlGraphQueryExecutable
& WhereBuilder<DescribeQuery>
& OrderBuilder<DescribeQuery>
& FromBuilder<DescribeQuery>
& LimitOffsetBuilder<DescribeQuery> & {
  readonly described: SparqlTemplateResult
}

export const DESCRIBE = (strings: TemplateStringsArray, ...values: SparqlValue<Variable | NamedNode>[]): DescribeQuery => ({
  ...Builder('CONSTRUCT'),
  ...graph,
  ...WHERE<DescribeQuery>({
    required: false,
  }),
  ...LIMIT(),
  ...FROM(),
  ...ORDER(),
  described: sparql(strings, ...values),
  _getTemplateResult() {
    return sparql`DESCRIBE ${this.described}
${this.fromClause()}
${this.whereClause()}
${this.orderClause()}
${this.limitOffsetClause()}`
  },
})
