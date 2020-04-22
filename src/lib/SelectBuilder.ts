import { DefaultGraph, NamedNode, Variable } from 'rdf-js'
import RDF from '@rdfjs/data-model'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { select } from './execute'
import Builder, { SparqlQuery, SparqlQueryExecutable } from './index'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'
import ORDER, { OrderBuilder } from './partials/ORDER'

type SelectQuery = SparqlQuery
& SparqlQueryExecutable
& WhereBuilder<SelectQuery>
& LimitOffsetBuilder<SelectQuery>
& OrderBuilder<SelectQuery>
& {
  readonly distinct: boolean
  readonly reduced: boolean
  readonly variables: SparqlTemplateResult
  readonly defaultGraph: NamedNode | DefaultGraph
  FROM(defaultGraph: NamedNode | DefaultGraph): SelectQuery
}

export const SELECT = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...Builder(),
  ...select,
  ...WHERE<SelectQuery>({
    required: true,
  }),
  ...LIMIT(),
  ...ORDER(),
  distinct: false,
  reduced: false,
  defaultGraph: RDF.defaultGraph(),
  variables: sparql(strings, ...values),
  FROM(graph: NamedNode | DefaultGraph): SelectQuery {
    return {
      ...this,
      defaultGraph: graph,
    }
  },
  _getTemplateResult() {
    const from = RDF.defaultGraph().equals(this.defaultGraph) ? null : sparql`FROM ${this.defaultGraph}`
    const modifier = this.distinct ? 'DISTINCT ' : this.reduced ? 'REDUCED ' : ''

    return sparql`SELECT ${modifier}${this.variables}
${from}
${this.whereClause()}
${this.orderClause()}
${this.limitOffsetClause()}`
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
