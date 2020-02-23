import { BlankNode, Literal, NamedNode } from 'rdf-js'
import { sparql, SparqlValue, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { SparqlQueryBuilder } from './index'
import { update } from './execute'
import { concat } from './TemplateResult'

interface InsertQuery extends SparqlQueryBuilder<void> {
  readonly insertPatterns: SparqlTemplateResult
  readonly wherePatterns?: SparqlTemplateResult
  readonly with?: NamedNode
  readonly using?: NamedNode[]
  readonly usingNamed?: NamedNode[]
}

interface InsertData extends SparqlQueryBuilder<void> {
  readonly quadData: SparqlTemplateResult
  DATA(strings: TemplateStringsArray, ...values: SparqlValue<NamedNode | Literal | BlankNode>[]): InsertData
}

export const INSERT = (strings: TemplateStringsArray, ...values: SparqlValue[]): InsertQuery => ({
  ...update,
  insertPatterns: sparql(strings, ...values),
  build(): string {
    return sparql`INSERT { ${this.insertPatterns} } WHERE { ${this.wherePatterns} }`.toString()
  },
})

INSERT.DATA = (strings: TemplateStringsArray, ...values: SparqlValue<NamedNode | Literal | BlankNode>[]): InsertData => ({
  ...update,
  quadData: sparql(strings, ...values),
  DATA(strings: TemplateStringsArray, ...values): InsertData {
    return {
      ...this,
      quadData: concat(this.quadData, strings, values),
    }
  },
  build(): string {
    return sparql`INSERT DATA {
  ${this.quadData}
}`.toString()
  },
})
