import { NamedNode, Stream, Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'

type DescribeQuery = SparqlQueryBuilder<Stream> & WhereBuilder<DescribeQuery> & {
  readonly described: SparqlTemplateResult
}

export const DESCRIBE = (strings: TemplateStringsArray, ...values: SparqlValue<Variable | NamedNode>[]): DescribeQuery => ({
  ...graph,
  ...WHERE<DescribeQuery>({
    required: false,
  }),
  described: sparql(strings, ...values),
  build(): string {
    return sparql`DESCRIBE ${this.described}
${this.whereClause()}`.toString()
  },
})
