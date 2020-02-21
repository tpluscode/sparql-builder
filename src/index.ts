import SparqlHttp from 'sparql-http-client'

export interface SparqlBuilderInit {
  baseUri?: string
  username?: string
  password?: string
}

const settings: SparqlBuilderInit = {}

export default settings

export interface SparqlQueryBuilder<TResult> {
  build(): string
  execute(client: SparqlHttp, requestInit?: RequestInit): Promise<TResult>
}

export { DELETE } from './DeleteBuilder'
export { INSERT } from './InsertBuilder'
export { ASK } from './AskBuilder'
export { DESCRIBE } from './DescribeBuilder'
export { CONSTRUCT } from './ConstructBuilder'
export { SELECT } from './SelectBuilder'
