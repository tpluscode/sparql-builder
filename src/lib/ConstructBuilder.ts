import { Stream } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'
import LIMIT, { LimitOffsetBuilder } from './partials/LIMIT'

type ConstructQuery = SparqlQueryBuilder<Stream> & WhereBuilder<ConstructQuery> & LimitOffsetBuilder<ConstructQuery> & {
  readonly constructTemplate: SparqlTemplateResult
}

export const CONSTRUCT = (strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery => ({
  ...graph,
  ...WHERE<ConstructQuery>({
    required: true,
  }),
  ...LIMIT(),
  constructTemplate: sparql(strings, ...values),
  build(): string {
    return sparql`CONSTRUCT { ${this.constructTemplate} }
${this.whereClause()}
${this.limitOffsetClause()}`.toString()
  },
})
