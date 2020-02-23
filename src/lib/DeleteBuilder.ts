import { Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute'
import { SparqlQueryBuilder } from './index'
import DATA, { QuadDataBuilder } from './partials/DATA'
import WHERE, { WhereBuilder } from './partials/WHERE'

type DeleteInsertQuery = WhereBuilder<DeleteInsertQuery> & SparqlQueryBuilder<void> & {
  readonly deletePatterns: SparqlTemplateResult
  readonly insertPatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
  INSERT(strings: TemplateStringsArray, ...values: any[]): Omit<DeleteInsertQuery, 'INSERT'>
}

type DeleteData = SparqlQueryBuilder<void> & QuadDataBuilder<DeleteData, NamedNode | Literal>

export const DELETE = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery => ({
  ...update,
  ...WHERE({
    required: true,
  }),
  deletePatterns: sparql(strings, ...values),
  build() {
    return sparql`DELETE { ${this.deletePatterns} } INSERT { ${this.insertPatterns} } ${this.whereClause()}`.toString()
  },
  INSERT(strings: TemplateStringsArray, ...values: SparqlValue[]) {
    return {
      ...this,
      insertPatterns: sparql(strings, ...values),
    }
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
