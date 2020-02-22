import { NamedNode } from 'rdf-js'
import { sparql } from '@tpluscode/rdf-string'
import { SparqlTemplateResult } from '@tpluscode/rdf-string/lib/sparql'
import { SparqlQueryBuilder } from './index'
import { update } from './execute'

interface InsertQuery extends SparqlQueryBuilder<void> {
  readonly insertPatterns: SparqlTemplateResult
  readonly wherePatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
}

interface InsertData extends SparqlQueryBuilder<void> {
  readonly quadData: SparqlTemplateResult
}

export const INSERT = (strings: TemplateStringsArray, ...values: any[]): InsertQuery => ({
  ...update,
  insertPatterns: sparql(strings, ...values),
  build(): string {
    return sparql`INSERT { ${this.insertPatterns} } WHERE { ${this.wherePatterns} }`.toString()
  },
})

INSERT.DATA = (strings: TemplateStringsArray, ...values: any[]): InsertData => ({
  ...update,
  quadData: sparql(strings, ...values),
  build(): string {
    return sparql`INSERT DATA {
  ${this.quadData}
}`.toString()
  },
})
