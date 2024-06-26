import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { graph } from './execute.js'
import WHERE, { WhereBuilder } from './partials/WHERE.js'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT.js'
import FROM, { FromBuilder } from './partials/FROM.js'
import Builder, { SparqlGraphQueryExecutable, SparqlQuery } from './index.js'

export type ConstructQuery = SparqlQuery
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
  ...Builder('CONSTRUCT'),
  ...graph,
  ...WHERE<ConstructQuery>({
    required: true,
  }),
  ...LIMIT(),
  ...FROM(),
  shorthand: false,
  constructTemplate: sparql(strings, ...values),
  _getTemplateResult(): SparqlTemplateResult {
    if (this.shorthand) {
      return sparql`CONSTRUCT
${this.fromClause()}
WHERE { ${this.constructTemplate} }
${this.limitOffsetClause()}`
    }

    return sparql`CONSTRUCT { ${this.constructTemplate} }
${this.fromClause()}
${this.whereClause()}
${this.limitOffsetClause()}`
  },
})

builder.WHERE = (strings: TemplateStringsArray, ...values: SparqlValue[]) => ({
  ...builder(strings, ...values),
  shorthand: true,
})

export const CONSTRUCT = builder as ConstructBuilder
