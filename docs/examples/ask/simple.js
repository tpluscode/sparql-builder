const { ASK } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

ASK`${person} a ${schema.Person}`.build()
