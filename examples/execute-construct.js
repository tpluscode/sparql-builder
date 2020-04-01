const ParsingClient = require('sparql-http-client/ParsingClient')
const { CONSTRUCT, SELECT } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { dataset } = require('@rdfjs/dataset')
const { dbo, foaf } = require('@tpluscode/rdf-ns-builders')
const { turtle } = require('@tpluscode/rdf-string')

const client = new ParsingClient({
  endpointUrl: 'http://dbpedia.org/sparql',
})

const person = variable('person')
const peopleBornInBerlin = SELECT`${person}`
  .WHERE` ${person} ${dbo.birthPlace} <http://dbpedia.org/resource/Berlin>`
  .LIMIT(100)

const quads = await CONSTRUCT`${person} ?p ?o`
  .WHERE`
        VALUES ?p { ${dbo.birthDate} ${dbo.deathDate} ${foaf.name} }
        ${person} ?p ?o .
        
        {
          ${peopleBornInBerlin} 
        }
    `
  .execute(client.query)

turtle`${dataset(quads)}`.toString()
