import { sparql, SparqlTemplateResult, SparqlValue } from '@tpluscode/rdf-string'

export function IN(...items: Array<SparqlValue>): SparqlTemplateResult {
  const list = items.reduce((previous: SparqlTemplateResult | null, next) => {
    if (!previous) {
      return sparql`${next}`
    }

    return sparql`${previous}, ${next}`
  }, null)

  return sparql`IN ( ${list || ''} )`
}
