import { BlankNode, Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { update } from './execute'
import DATA, { QuadDataBuilder } from './partials/DATA'
import WHERE, { WhereBuilder } from './partials/WHERE'
import InsertBuilderPartial, { InsertBuilder } from './partials/INSERT'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index'

export type InsertQuery = SparqlQuery
& SparqlUpdateExecutable
& InsertBuilder<InsertQuery>
& WhereBuilder<InsertQuery> & {
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
}

export type InsertData = SparqlQuery & SparqlUpdateExecutable & QuadDataBuilder<InsertData, NamedNode | Literal | BlankNode>

export const INSERT = (strings: TemplateStringsArray, ...values: SparqlValue[]): InsertQuery => ({
  ...Builder('UPDATE'),
  ...update,
  ...WHERE<InsertQuery>({
    required: true,
  }),
  ...InsertBuilderPartial(sparql(strings, ...values)),
  _getTemplateResult() {
    return sparql`${this.insertClause()} ${this.whereClause()}`
  },
})

INSERT.DATA = (strings: TemplateStringsArray, ...values: SparqlValue<NamedNode | Literal | BlankNode>[]): InsertData => ({
  ...Builder('UPDATE'),
  ...update,
  ...DATA<InsertData, NamedNode | Literal | BlankNode>(strings, values),
  _getTemplateResult() {
    return sparql`INSERT DATA {
  ${this.quadData}
}`
  },
})
