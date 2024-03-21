import { NamedNode } from '@rdfjs/types'
import { sparql } from '@tpluscode/rdf-string'
import RDF from '@rdfjs/data-model'
import { InsertQuery } from './InsertBuilder.js'
import { DeleteInsertQuery } from './DeleteBuilder.js'
import { update } from './execute.js'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index.js'

type WithQuery = SparqlUpdateExecutable & SparqlQuery

export const WITH = (graph: NamedNode | string, query: DeleteInsertQuery | InsertQuery): WithQuery => ({
  ...Builder('UPDATE'),
  ...update,
  _getTemplateResult() {
    const graphNode = typeof graph === 'string' ? RDF.namedNode(graph) : graph

    return sparql`WITH ${graphNode}\n${query._getTemplateResult()}`
  },
})
