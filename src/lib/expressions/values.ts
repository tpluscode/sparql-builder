import { SparqlTemplateResult, SparqlValue, sparql } from '@tpluscode/rdf-string'
import RDF from '@rdfjs/data-model'

type ValueMap<Variables extends string> = Record<Variables, SparqlValue>

function toSingleLine(line: SparqlTemplateResult | undefined, value: SparqlValue): SparqlTemplateResult {
  return sparql`${line} ${value}`
}

export function VALUES<Variables extends string>(...values: Partial<ValueMap<Variables>>[]): SparqlTemplateResult | string {
  if (values.length === 0) {
    return ''
  }

  const variables = [...new Set(values.map(Object.keys).flat())].map(RDF.variable)

  const vectors = values.reduce((previous, current: Record<string, unknown>) => {
    const vector = variables.map((variable) => {
      const value = current[variable.value]
      if (value === null || typeof value === 'undefined') {
        return 'UNDEF'
      }
      if (typeof value === 'string') {
        return RDF.literal(value)
      }
      return value
    })

    return sparql`${previous}\n(${vector.reduce(toSingleLine, sparql``)} )`
  }, sparql``)

  return sparql`VALUES (${variables.reduce(toSingleLine, sparql``)} )
{${vectors}
}`
}
