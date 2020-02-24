# How it works

The API takes top-level keywords of SPARQL Query/Update and exports them
as builder. The intention is to closely match the syntax of SPARQL within
JavaScript source code.

For example, here's a slightly more complex query which uses a number of
SPARQL's constructs:

```sparql
BASE <http://example.com/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?person ?name
FROM <people>
WHERE {
  ?person a foaf:Person .
  ?person schema:name ?name .
}
LIMIT 10 OFFSET 130
```

This could be written in JS as follows.

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { foaf, schema } = require('@tpluscode/rdf-ns-builders')
const RDF = require('@rdfjs/data-model')

const people = RDF.namedNode('http://example.com/people')
const person = RDF.variable('person')
const name = RDF.variable('name')

SELECT.DISTINCT`${person} ${name}`
.FROM(people)
.WHERE`
    ${person} a ${foaf.Person} .
    ${person} ${schema.name} ${name} .
`
.LIMIT(10).OFFSET(130)
```

</run-kit>
