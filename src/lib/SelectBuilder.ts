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

interface Select {
  (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery
  DISTINCT: (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]) => SelectQuery
  REDUCED: (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]) => SelectQuery
  ALL: SelectQuery
}

const SelectBuilder = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
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

SelectBuilder.DISTINCT = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...SelectBuilder(strings, ...values),
  distinct: true,
})

SelectBuilder.REDUCED = (strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery => ({
  ...SelectBuilder(strings, ...values),
  reduced: true,
})

Object.defineProperty(SelectBuilder, 'ALL', {
  get() {
    return SelectBuilder`*`
  },
})

export const SELECT = SelectBuilder as Select
