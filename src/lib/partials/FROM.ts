import { DefaultGraph, NamedNode } from 'rdf-js'
import TermSet from '@rdfjs/term-set'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { SparqlQuery } from '../index.js'

interface FromNamed<T> {
  NAMED(graph: NamedNode): T
}

export interface FromBuilder<T> {
  readonly defaultGraph: Set<NamedNode>
  readonly fromNamed: Set<NamedNode>
  FROM(defaultGraph: NamedNode | DefaultGraph): T
  FROM(): FromNamed<T>
  fromClause(): SparqlTemplateResult
}

export default function <T extends SparqlQuery & FromBuilder<T>> (): FromBuilder<T> {
  const builder = {
    defaultGraph: new TermSet<NamedNode>(),
    fromNamed: new TermSet<NamedNode>(),
    fromClause(): SparqlTemplateResult {
      const clause = [...this.defaultGraph.values()].reduce((current, graph) => sparql`${current}\nFROM ${graph}`, sparql``)

      return [...this.fromNamed.values()].reduce((current, graph) => sparql`${current}\nFROM NAMED ${graph}`, clause)
    },
  }

  return {
    ...builder,
    FROM(defaultGraph?: NamedNode | DefaultGraph): any {
      if (!defaultGraph) {
        return {
          NAMED: (graph: NamedNode) => {
            this.fromNamed.add(graph)
            return this
          },
        }
      }

      if (defaultGraph.termType === 'DefaultGraph') {
        this.defaultGraph.clear()
      } else {
        this.defaultGraph.add(defaultGraph)
      }
      return this
    },
  }
}
