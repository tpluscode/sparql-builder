import { Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute'
import { SparqlQueryBuilder } from './index'
import DATA, { QuadDataBuilder } from './partials/DATA'

interface DeleteInsertQuery extends SparqlQueryBuilder<void> {
  readonly deletePatterns: SparqlTemplateResult
  readonly insertPatterns?: SparqlTemplateResult
  readonly wherePatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
  INSERT(strings: TemplateStringsArray, ...values: any[]): Omit<DeleteInsertQuery, 'INSERT'>
}

type DeleteData = SparqlQueryBuilder<void> & QuadDataBuilder<DeleteData, NamedNode | Literal>

export const DELETE = (strings: TemplateStringsArray, ...values: SparqlValue[]): DeleteInsertQuery => ({
  ...update,
  deletePatterns: sparql(strings, ...values),
  build() {
    return sparql`DELETE { ${this.deletePatterns} } INSERT { ${this.insertPatterns} } WHERE { ${this.wherePatterns} }`.toString()
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
