import { Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { update } from './execute'
import { SparqlQueryBuilder } from './index'

interface DeleteInsertQuery extends SparqlQueryBuilder<void> {
  readonly deletePatterns: SparqlTemplateResult
  readonly insertPatterns?: SparqlTemplateResult
  readonly wherePatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
  INSERT(strings: TemplateStringsArray, ...values: any[]): Omit<DeleteInsertQuery, 'INSERT'>
}

interface DeleteData extends SparqlQueryBuilder<void> {
  readonly quadData: SparqlTemplateResult
}

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
  quadData: sparql(strings, ...values),
  build(): string {
    return sparql`DELETE DATA {
  ${this.quadData}
}`.toString()
  },
})
