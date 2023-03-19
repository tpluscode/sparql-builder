import { Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { SparqlQuery } from '../index.js'

interface OrderCondition {
  variable: Variable
  desc: boolean
}

interface ThenOrderByBuilder<T> {
  // eslint-disable-next-line no-use-before-define
  THEN: OrderByBuilder<T>
}

interface OrderByBuilder<T> {
  BY(variable: Variable, desc?: boolean): T & ThenOrderByBuilder<T>
}

export interface OrderBuilder<T> {
  orderConditions: OrderCondition[]
  orderClause(): SparqlTemplateResult
  ORDER(): OrderByBuilder<T>
}

function addOrder<T extends SparqlQuery & OrderBuilder<T>>(builder: OrderBuilder<T>) {
  return (variable: Variable, desc: boolean): T & ThenOrderByBuilder<T> => {
    const thenBuilder = {
      ...builder,
      orderConditions: [
        ...builder.orderConditions, {
          variable,
          desc,
        }],
    }

    return {
      ...thenBuilder,
      THEN: {
        BY: addOrder(thenBuilder),
      },
    } as T & ThenOrderByBuilder<T>
  }
}

export default <T extends SparqlQuery & OrderBuilder<T>>(): OrderBuilder<T> => ({
  orderConditions: [],
  ORDER(): OrderByBuilder<T> {
    return {
      BY: addOrder(this),
    }
  },
  orderClause() {
    if (this.orderConditions.some(Boolean)) {
      return this.orderConditions.reduce((result, condition) => {
        if (condition.desc) {
          return sparql`${result} desc(${condition.variable})`
        }

        return sparql`${result} ${condition.variable}`
      },
      sparql`ORDER BY`)
    }

    return sparql``
  },
})
