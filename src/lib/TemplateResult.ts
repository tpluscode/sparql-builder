import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'

interface Options {
  wrapTemplate?: boolean
  newLineSeparator?: boolean
}

export function concat(
  current: SparqlTemplateResult | null | undefined,
  strings: TemplateStringsArray,
  values: SparqlValue[],
  { wrapTemplate = false, newLineSeparator = true }: Options = {}): SparqlTemplateResult {
  let next = sparql(strings, ...values)
  if (wrapTemplate) {
    next = sparql`( ${next} )`
  }

  if (!current) {
    return next
  }

  return sparql`${current}${newLineSeparator ? '\n' : ''}
${next}`
}
