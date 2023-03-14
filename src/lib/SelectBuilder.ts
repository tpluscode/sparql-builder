import { Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { select } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'
import ORDER, { OrderBuilder } from './partials/ORDER'
import FROM, { FromBuilder } from './partials/FROM'
import GROUP, { GroupBuilder } from './partials/GROUP'
import HAVING, { HavingBuilder } from './partials/HAVING'
import Builder, { SparqlQuery, SparqlQueryExecutable } from './index'

export type SelectQuery = SparqlQuery
& SparqlQueryExecutable
& WhereBuilder<SelectQuery>
& LimitOffsetBuilder<SelectQuery>
& OrderBuilder<SelectQuery>
& GroupBuilder<SelectQuery>
& HavingBuilder<SelectQuery>
& FromBuilder<SelectQuery>
& {
  readonly distinct: boolean
  readonly reduced: boolean
  readonly variables: SparqlTemplateResult
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
  ...GROUP(),
  ...HAVING(),
  ...FROM(),
  distinct: false,
  reduced: false,
  variables: sparql(strings, ...values),
  _getTemplateResult() {
    const modifier = this.distinct ? 'DISTINCT ' : this.reduced ? 'REDUCED ' : ''

    return sparql`SELECT ${modifier}${this.variables}
${this.fromClause()}
${this.whereClause()}
${this.orderClause()}
${this.groupByClause()}
${this.havingClause()}
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
