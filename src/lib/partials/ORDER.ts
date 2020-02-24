import { SparqlQueryBuilder } from '../index'
import { Variable } from 'rdf-js'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'

interface OrderCondition {
  variable: Variable
  desc: boolean
}

interface OrderByBuilder<T> {
  BY(variable: Variable, desc?: boolean): T
}

export interface OrderBuilder<T> {
  orderConditions: OrderCondition[]
  orderClause(): SparqlTemplateResult
  ORDER(): OrderByBuilder<T>
}

export default <T extends SparqlQueryBuilder & OrderBuilder<T>>(): OrderBuilder<T> => ({
  orderConditions: [],
  ORDER(): OrderByBuilder<T> {
    return {
      BY: (variable, desc = false) => {
        return {
          ...this,
          orderConditions: [
            ...this.orderConditions, {
              variable,
              desc,
            }],
        } as T
      },
    }
  },
  orderClause() {
    if (this.orderConditions.some(Boolean)) {
      return this.orderConditions.reduce((result, condition) => {
        return sparql`${result} ${condition.variable}`
      },
      sparql`ORDER BY`)
    }

    return sparql``
  },
})
