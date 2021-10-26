import type * as Lib from './lib'

export { sparql } from '@tpluscode/rdf-string'
export { DELETE } from './lib/DeleteBuilder'
export { INSERT } from './lib/InsertBuilder'
export { ASK } from './lib/AskBuilder'
export { DESCRIBE } from './lib/DescribeBuilder'
export { CONSTRUCT } from './lib/ConstructBuilder'
export { SELECT } from './lib/SelectBuilder'
export { WITH } from './lib/WithBuilder'
export type { SparqlTemplateResult } from '@tpluscode/rdf-string'

export type Select = Lib.SparqlQueryExecutable & Lib.SparqlQuery
export type Construct = Lib.SparqlGraphQueryExecutable & Lib.SparqlQuery
export type Update = Lib.SparqlUpdateExecutable & Lib.SparqlQuery
export type Ask = Lib.SparqlAskExecutable & Lib.SparqlQuery
