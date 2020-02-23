import { Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute'
import { SparqlQueryBuilder } from './index'
import DATA, { QuadDataBuilder } from './partials/DATA'
import WHERE, { WhereBuilder } from './partials/WHERE'
import INSERT, { InsertBuilder } from './partials/INSERT'
import { concat } from './TemplateResult'

type DeleteInsertQuery = InsertBuilder<DeleteInsertQuery> & WhereBuilder<DeleteInsertQuery> & SparqlQueryBuilder<void> & {
  readonly deletePatterns: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
  DELETE(strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery
}

type DeleteData = SparqlQueryBuilder<void> & QuadDataBuilder<DeleteData, NamedNode | Literal>

export const DELETE = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery => ({
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
  build() {
    return sparql`DELETE { ${this.deletePatterns} } ${this.insertClause()} ${this.whereClause()}`.toString()
  },
})

DELETE.DATA = (strings: TemplateStringsArray, ...values: (NamedNode | Literal)[]): DeleteData => ({
  ...update,
  ...DATA<DeleteData, NamedNode | Literal>(strings, values),
  build(): string {
    return sparql`DELETE DATA {
  ${this.quadData}
}`.toString()
  },
})
