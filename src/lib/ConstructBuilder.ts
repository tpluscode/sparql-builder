import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'
import FROM, { FromBuilder } from './partials/FROM'
import Builder, { SparqlGraphQueryExecutable, SparqlQuery } from './index'

type ConstructQuery = SparqlQuery
& SparqlGraphQueryExecutable
& WhereBuilder<ConstructQuery>
& FromBuilder<ConstructQuery>
& LimitOffsetBuilder<ConstructQuery> & {
  readonly constructTemplate: SparqlTemplateResult
  readonly shorthand: boolean
}

interface ConstructBuilder {
  (strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery
  WHERE(strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery
}

const builder = (strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery => ({
  ...Builder(),
  ...graph,
  ...WHERE<ConstructQuery>({
    required: true,
  }),
  ...LIMIT(),
  ...FROM(),
  shorthand: false,
  constructTemplate: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    return sparql`CONSTRUCT ${this.shorthand ? 'WHERE' : ''} { ${this.constructTemplate} }
${this.fromClause()}
${this.shorthand ? '' : this.whereClause()}
${this.limitOffsetClause()}`
  },
})

builder.WHERE = (strings: TemplateStringsArray, ...values: SparqlValue[]) => ({
  ...builder(strings, values),
  shorthand: true,
})

export const CONSTRUCT = builder as ConstructBuilder
