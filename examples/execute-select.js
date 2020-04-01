const ParsingClient = require('sparql-http-client/ParsingClient')
const { SELECT } = require('@tpluscode/sparql-query')
const { variable } = require('@rdfjs/data-model')
const { dbo, foaf } = require('@tpluscode/rdf-ns-builders')

const client = new ParsingClient({
  endpointUrl: 'http://dbpedia.org/sparql',
})

const name = variable('name')
const birth = variable('birth')
const death = variable('death')
const person = variable('person')
const maxBirth = new Date(1900, 1, 1)

const results = await SELECT`${name} ${birth} ${death} ${person}`
  .WHERE`
        ${person} ${dbo.birthPlace} <http://dbpedia.org/resource/Berlin> .
        ${person} ${dbo.birthDate} ${birth} .
        ${person} ${foaf.name} ${name} .
        ${person} ${dbo.deathDate} ${death} .
    `
  .LIMIT(20)
  // .FILTER`${birth} < ${maxBirth}`
  .ORDER().BY(name)
  .execute(client.query)

results.map(r => ({
  person: r.person.value,
  name: r.name.value,
  birth: r.birth.value,
  death: r.death.value,
}))
