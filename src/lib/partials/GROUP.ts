import { Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'
import RDF from '@rdfjs/data-model'
import { SparqlQuery } from '../index.js'

interface Grouping {
  by: SparqlTemplateResult
  as?: Variable
}

interface ThenGroupByBuilder<T> {
  // eslint-disable-next-line no-use-before-define
  THEN: GroupByBuilder<T>
}

interface BoundGroupBuilder<T> extends ThenGroupByBuilder<T> {
  AS(variable: Variable | string): T & ThenGroupByBuilder<T>
}

interface GroupByBuilder<T> {
  BY(strings: TemplateStringsArray, ...values: SparqlValue[]): T & BoundGroupBuilder<T>
  BY(variable: string | Variable, ...values: SparqlValue[]): T & BoundGroupBuilder<T>
}

export interface GroupBuilder<T> {
  groupings: Grouping[]
  groupByClause(): SparqlTemplateResult
  GROUP(): GroupByBuilder<T>
}

function isTemplateArray(arg: TemplateStringsArray | unknown): arg is TemplateStringsArray {
  return Array.isArray(arg)
}

function addGrouping<T extends SparqlQuery & GroupBuilder<T>>(builder: GroupBuilder<T>) {
  return (strings: TemplateStringsArray | string | Variable, ...values: SparqlValue[]): T & BoundGroupBuilder<T> => {
    let by: SparqlTemplateResult
    if (isTemplateArray(strings)) {
      by = sparql(strings, ...values)
    } else if (typeof strings === 'string') {
      by = sparql`${RDF.variable(strings)}`
    } else {
      by = sparql`${strings}`
    }

    const grouping: Grouping = { by }
    const childBuilder = {
      ...builder,
      groupings: [...builder.groupings, grouping],
    } as T & GroupBuilder<T>
    const thenBuilder: T & ThenGroupByBuilder<T> = {
      ...childBuilder,
      THEN: {
        BY: addGrouping(childBuilder),
      },
    }

    return {
      ...thenBuilder,
      AS(variable: string | Variable) {
        if (typeof variable === 'string') {
          grouping.as = RDF.variable(variable)
        } else {
          grouping.as = variable
        }

        return thenBuilder
      },
    } as T & BoundGroupBuilder<T>
  }
}

export default <T extends SparqlQuery & GroupBuilder<T>>(): GroupBuilder<T> => ({
  groupings: [],
  GROUP(): GroupByBuilder<T> {
    return {
      BY: addGrouping(this),
    }
  },
  groupByClause() {
    if (this.groupings.some(Boolean)) {
      return this.groupings.reduce((result, grouping) => {
        if (grouping.as) {
          return sparql`${result}\n    (${grouping.by} as ${grouping.as})`
        }

        return sparql`${result}\n    (${grouping.by})`
      },
      sparql`GROUP BY`)
    }

    return sparql``
  },
})
