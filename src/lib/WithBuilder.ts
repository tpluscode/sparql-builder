import { NamedNode } from 'rdf-js'
import { sparql } from '@tpluscode/rdf-string'
import { namedNode } from '@rdf-esm/data-model'
import { InsertQuery } from './InsertBuilder'
import { DeleteInsertQuery } from './DeleteBuilder'
import { update } from './execute'
import Builder, { SparqlQuery, SparqlUpdateExecutable } from './index'

type WithQuery = SparqlUpdateExecutable & SparqlQuery

export const WITH = (graph: NamedNode | string, query: DeleteInsertQuery | InsertQuery): WithQuery => ({
  ...Builder('UPDATE'),
  ...update,
  _getTemplateResult() {
    const graphNode = typeof graph === 'string' ? namedNode(graph) : graph

    return sparql`WITH ${graphNode}\n${query._getTemplateResult()}`
  },
})
