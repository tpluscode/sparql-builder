import { BlankNode, Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { update } from './execute'
import DATA, { QuadDataBuilder } from './partials/DATA'
import WHERE, { WhereBuilder } from './partials/WHERE'

type InsertQuery = SparqlQueryBuilder<void> & WhereBuilder<InsertQuery> & {
  readonly insertPatterns: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
}

type InsertData = SparqlQueryBuilder<void> & QuadDataBuilder<InsertData, NamedNode | Literal | BlankNode>

export const INSERT = (strings: TemplateStringsArray, ...values: SparqlValue[]): InsertQuery => ({
  ...update,
  ...WHERE<InsertQuery>({
    required: true,
  }),
  insertPatterns: sparql(strings, ...values),
  build(): string {
    return sparql`INSERT { ${this.insertPatterns} } ${this.whereClause()}`.toString()
  },
})

INSERT.DATA = (strings: TemplateStringsArray, ...values: SparqlValue<NamedNode | Literal | BlankNode>[]): InsertData => ({
  ...update,
  ...DATA<InsertData, NamedNode | Literal | BlankNode>(strings, values),
  build(): string {
    return sparql`INSERT DATA {
  ${this.quadData}
}`.toString()
  },
})
