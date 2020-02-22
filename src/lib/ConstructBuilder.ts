import { Stream } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { graph } from './execute'
import WHERE, { WhereBuilder } from './partials/WHERE'

type ConstructQuery = SparqlQueryBuilder<Stream> & WhereBuilder<ConstructQuery> & {
  readonly graphTemplate: SparqlTemplateResult
}

export const CONSTRUCT = (strings: TemplateStringsArray, ...values: SparqlValue[]): ConstructQuery => ({
  ...graph,
  ...WHERE<ConstructQuery>({
    required: true,
  }),
  graphTemplate: sparql(strings, ...values),
  build(): string {
    return sparql`CONSTRUCT { ${this.graphTemplate} } ${this.whereClause()}`.toString()
  },
})
