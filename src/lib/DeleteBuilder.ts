import { Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index'
import DATA, { QuadDataBuilder } from './partials/DATA'
import WHERE, { WhereBuilder } from './partials/WHERE'
import INSERT, { InsertBuilder } from './partials/INSERT'
import { concat } from './TemplateResult'

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

type DeleteData = SparqlQuery & SparqlUpdateExecutable & QuadDataBuilder<DeleteData, NamedNode | Literal>

export const DELETE = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery => ({
  ...Builder(),
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

DELETE.DATA = (strings: TemplateStringsArray, ...values: (NamedNode | Literal)[]): DeleteData => ({
  ...Builder(),
  ...update,
  ...DATA<DeleteData, NamedNode | Literal>(strings, values),
  _getTemplateResult() {
    return sparql`DELETE DATA {
  ${this.quadData}
}`
  },
})
