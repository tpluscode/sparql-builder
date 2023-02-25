import { SparqlTemplateResult, sparql } from '@tpluscode/rdf-string'

export function UNION(...[first, ...rest]: SparqlTemplateResult[]): SparqlTemplateResult {
  if (rest.length === 0) {
    return first || ''
  }

  return rest.reduce((previousValue, currentValue) => {
    return sparql`${previousValue} UNION {
      ${currentValue}
    }`
  }, sparql`{ 
    ${first} 
  }`)
}
