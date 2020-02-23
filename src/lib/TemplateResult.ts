import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'

export function concat(current: SparqlTemplateResult | null | undefined, strings: TemplateStringsArray, values: SparqlValue[]) {
  if (!current) {
    return sparql(strings, ...values)
  }

  return sparql`${current}
  
${sparql(strings, ...values)}`
}
