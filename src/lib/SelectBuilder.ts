import { Variable } from '@rdfjs/types'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { select } from './execute.js'
import WHERE, { WhereBuilder } from './partials/WHERE.js'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT.js'
import ORDER, { OrderBuilder } from './partials/ORDER.js'
import FROM, { FromBuilder } from './partials/FROM.js'
import GROUP, { GroupBuilder } from './partials/GROUP.js'
import HAVING, { HavingBuilder } from './partials/HAVING.js'
import Builder, { SparqlQuery, SparqlQueryExecutable } from './index.js'

export type SelectQuery = SparqlQuery
& SparqlQueryExecutable
& WhereBuilder<SelectQuery>
& LimitOffsetBuilder<SelectQuery>
& OrderBuilder<SelectQuery>
& GroupBuilder<SelectQuery>
& HavingBuilder<SelectQuery>
& FromBuilder<SelectQuery>
& {
  DISTINCT(): SelectQuery
  AND(strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]): SelectQuery
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
  ...Builder('SELECT'),
  ...select,
  ...WHERE<SelectQuery>({
    required: true,
  }),
  ...LIMIT(),
  ...ORDER(),
  ...GROUP(),
  ...HAVING(),
  ...FROM(),
  DISTINCT() {
    return {
      ...this,
      distinct: true,
    }
  },
  AND(strings: TemplateStringsArray, ...values: SparqlValue<Variable>[]) {
    return {
      ...this,
      variables: sparql`${this.variables}${sparql(strings, ...values)}`,
    }
  },
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
