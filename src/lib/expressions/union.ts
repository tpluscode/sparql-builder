import { SparqlTemplateResult, sparql, SparqlValue } from '@tpluscode/rdf-string'

export function UNION(...[first, ...rest]: Array<SparqlValue>): SparqlTemplateResult {
  if (rest.length === 0) {
    return sparql`${first}` || ''
  }

  return rest.reduce<SparqlTemplateResult>((previousValue, currentValue) => {
    return sparql`${previousValue} UNION {
      ${currentValue}
    }`
  }, sparql`{ 
    ${first} 
  }`)
}
