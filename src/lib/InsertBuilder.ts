import { BlankNode, Literal, NamedNode } from '@rdfjs/types'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { update } from './execute.js'
import DATA, { QuadDataBuilder } from './partials/DATA.js'
import WHERE, { WhereBuilder } from './partials/WHERE.js'
import InsertBuilderPartial, { InsertBuilder } from './partials/INSERT.js'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index.js'

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
