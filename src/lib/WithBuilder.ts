import { NamedNode } from 'rdf-js'
import { sparql } from '@tpluscode/rdf-string'
import { namedNode } from '@rdfjs/data-model'
import { InsertQuery } from './InsertBuilder'
import { DeleteInsertQuery } from './DeleteBuilder'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index'
import { update } from './execute'

type WithQuery = SparqlUpdateExecutable & SparqlQuery

export const WITH = (graph: NamedNode | string, query: DeleteInsertQuery | InsertQuery): WithQuery => ({
  ...Builder(),
  ...update,
  _getTemplateResult() {
    const graphNode = typeof graph === 'string' ? namedNode(graph) : graph

    return sparql`WITH ${graphNode}\n${query._getTemplateResult()}`
  },
})
