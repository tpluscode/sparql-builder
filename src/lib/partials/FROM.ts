import { DefaultGraph, NamedNode } from 'rdf-js'
import RDF, { defaultGraphInstance } from '@rdfjs/data-model'
import { SparqlQuery } from '../index'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'

interface FromNamed<T> {
  NAMED(graph: NamedNode): T
}

export interface FromBuilder<T> {
  readonly defaultGraph: NamedNode | DefaultGraph
  readonly fromNamed: NamedNode[]
  FROM(defaultGraph: NamedNode | DefaultGraph): T
  FROM(): FromNamed<T>
  fromClause(): SparqlTemplateResult
}

export default function <T extends SparqlQuery & FromBuilder<T>> (): FromBuilder<T> {
  const builder = {
    defaultGraph: RDF.defaultGraph(),
    fromNamed: [],
    fromClause(): SparqlTemplateResult {
      const clause = !this.defaultGraph.equals(defaultGraphInstance) ? sparql`FROM ${this.defaultGraph}` : sparql``

      return this.fromNamed.reduce((current, graph) => sparql`${current}\nFROM NAMED ${graph}`, clause)
    },
  }

  return {
    ...builder,
    FROM(defaultGraph?: NamedNode | DefaultGraph): any {
      if (!defaultGraph) {
        return {
          NAMED: (graph: NamedNode) => ({
            ...this,
            fromNamed: [...this.fromNamed, graph],
          }),
        }
      }

      return {
        ...this,
        defaultGraph,
      }
    },
  }
}
