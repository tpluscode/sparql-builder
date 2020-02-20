import { SelectBuilder } from './SelectBuilder'
import { AskBuilder } from './AskBuilder'
import { ConstructBuilder } from './ConstructBuilder'
import { InsertDataBuilder } from './InsertDataBuilder'
import { DeleteInsertBuilder } from './DeleteInsertBuilder'
import { DescribeBuilder } from './DescribeBuilder'
import { SparqlBuilderInit } from './Builder'

const settings: SparqlBuilderInit = {}

export default settings

export function construct() {
  return new ConstructBuilder(settings)
}

export function select(...variables: string[]) {
  return new SelectBuilder(settings).variables(...variables)
}

export function ask(...patterns: string[]) {
  return new AskBuilder(settings).where(...patterns)
}

export function insertData(...data: string[]) {
  return new InsertDataBuilder(settings).graph(...data)
}

export function deleteInsert(...deletePatterns: string[]) {
  return new DeleteInsertBuilder(settings).delete(...deletePatterns)
}

export function describe(idOrVariable: string, ...idOrVariables: string[]) {
  return new DescribeBuilder(settings).variables(idOrVariable, ...idOrVariables)
}
