import { Literal, NamedNode } from '@rdfjs/types'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute.js'
import DATA, { QuadDataBuilder } from './partials/DATA.js'
import WHERE, { WhereBuilder } from './partials/WHERE.js'
import INSERT, { InsertBuilder } from './partials/INSERT.js'
import { concat } from './TemplateResult.js'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index.js'

export type DeleteInsertQuery = InsertBuilder<DeleteInsertQuery>
& WhereBuilder<DeleteInsertQuery>
& SparqlQuery
& SparqlUpdateExecutable & {
  readonly deletePatterns: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
  DELETE(strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery
}

export type DeleteData = SparqlQuery & SparqlUpdateExecutable & QuadDataBuilder<DeleteData, NamedNode | Literal>

export const DELETE = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery => ({
  ...Builder('UPDATE'),
  ...update,
  ...WHERE({
    required: true,
  }),
  ...INSERT(),
  deletePatterns: sparql(strings, ...values),
  DELETE(strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery {
    return {
      ...this,
      deletePatterns: concat(this.deletePatterns, strings, values),
    }
  },
  _getTemplateResult() {
    if (!this.insertPatterns) {
      return sparql`DELETE { ${this.deletePatterns} } ${this.whereClause()}`
    }

    return sparql`DELETE { ${this.deletePatterns} } ${this.insertClause()} ${this.whereClause()}`
  },
})

DELETE.DATA = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteData => ({
  ...Builder('UPDATE'),
  ...update,
  ...DATA<DeleteData, NamedNode | Literal>(strings, values),
  _getTemplateResult() {
    return sparql`DELETE DATA {
  ${this.quadData}
}`
  },
})
