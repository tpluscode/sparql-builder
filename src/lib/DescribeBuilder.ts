import { NamedNode, Stream, Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import Builder, { SparqlQuery } from './index'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type DescribeQuery = SparqlQuery<Stream> & WhereBuilder<DescribeQuery> & LimitOffsetBuilder<DescribeQuery> & {
  readonly described: SparqlTemplateResult
}

export const DESCRIBE = (strings: TemplateStringsArray, ...values: SparqlValue<Variable | NamedNode>[]): DescribeQuery => ({
  ...Builder(),
  ...graph,
  ...WHERE<DescribeQuery>({
    required: false,
  }),
  ...LIMIT(),
  described: sparql(strings, ...values),
  _getTemplateResult() {
    return sparql`DESCRIBE ${this.described}
${this.whereClause()}
${this.limitOffsetClause()}`
  },
})
