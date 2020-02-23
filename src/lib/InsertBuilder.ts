import { BlankNode, Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { update } from './execute'
import DATA, { QuadDataBuilder } from './partials/DATA'

interface InsertQuery extends SparqlQueryBuilder<void> {
  readonly insertPatterns: SparqlTemplateResult
  readonly wherePatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
}

type InsertData = SparqlQueryBuilder<void> & QuadDataBuilder<InsertData, NamedNode | Literal | BlankNode>

export const INSERT = (strings: TemplateStringsArray, ...values: SparqlValue[]): InsertQuery => ({
  ...update,
  insertPatterns: sparql(strings, ...values),
  build(): string {
    return sparql`INSERT { ${this.insertPatterns} } WHERE { ${this.wherePatterns} }`.toString()
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
