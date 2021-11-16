import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'

export function concat(
  current: SparqlTemplateResult | null | undefined,
  strings: TemplateStringsArray,
  values: SparqlValue[],
  wrapTemplate = false): SparqlTemplateResult {
  let next = sparql(strings, ...values)
  if (wrapTemplate) {
    next = sparql`( ${next} )`
  }

  if (!current) {
    return next
  }

  return sparql`${current}
  
${next}`
}
