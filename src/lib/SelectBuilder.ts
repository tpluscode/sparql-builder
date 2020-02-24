import { DefaultGraph, NamedNode, Term, Variable } from 'rdf-js'
import { defaultGraph } from '@rdfjs/data-model'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { select } from './execute'
import { SparqlQueryBuilder } from './index'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type SelectQuery = SparqlQueryBuilder<readonly Record<string, Term>[]>
& WhereBuilder<SelectQuery>
& LimitOffsetBuilder<SelectQuery>
& {
  readonly distinct: boolean
  readonly reduced: boolean
  readonly variables: SparqlTemplateResult
  readonly defaultGraph: NamedNode | DefaultGraph
  FROM(defaultGraph: NamedNode | DefaultGraph): SelectQuery
}

export const SELECT = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...select,
  ...WHERE<SelectQuery>({
    required: true,
  }),
  ...LIMIT(),
  distinct: false,
  reduced: false,
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
    const modifier = this.distinct ? 'DISTINCT ' : this.reduced ? 'REDUCED ' : ''

    return sparql`SELECT ${modifier}${this.variables}
${from}
${this.whereClause()}
${this.limitOffsetClause()}`.toString()
  },
})

SELECT.DISTINCT = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...SELECT(strings, ...values),
  distinct: true,
})

SELECT.REDUCED = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...SELECT(strings, ...values),
  reduced: true,
})
