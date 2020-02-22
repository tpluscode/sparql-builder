import { DefaultGraph, NamedNode, Term, Variable } from 'rdf-js'
import { defaultGraph } from '@rdfjs/data-model'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { select } from './execute'
import { SparqlQueryBuilder } from './index'
import WHERE, { WhereBuilder } from './partials/WHERE'

type SelectQuery = SparqlQueryBuilder<readonly Record<string, Term>[]> & WhereBuilder<SelectQuery> & {
  readonly variables: SparqlTemplateResult
  readonly defaultGraph: NamedNode | DefaultGraph
  FROM(defaultGraph: NamedNode | DefaultGraph): SelectQuery
}

export const SELECT = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...select,
  ...WHERE<SelectQuery>({
    required: true,
  }),
  defaultGraph: defaultGraph(),
  variables: sparql(strings, ...values),
  FROM(graph): SelectQuery {
    return {
      ...this,
      defaultGraph: graph,
    }
  },
  build(): string {
    const from = defaultGraph().equals(this.defaultGraph) ? null : sparql`FROM ${this.defaultGraph}`

    return sparql`SELECT ${this.variables}
${from}
${this.whereClause()}`.toString()
  },
})
