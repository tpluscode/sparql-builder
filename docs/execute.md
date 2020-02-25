# Execute a SPARQL Query

It is possible to run queries with a simple [sparql-http-client][client] library.
It is a peer dependency so it must be installed explicitly.

```
npm i -S sparql-http-client
```

[client]: https://npm.im/sparql-http-client

## DBpedia examples

The queries below are adapted from DBpedias [Online Access](https://wiki.dbpedia.org/OnlineAccess) examples.

### SELECT

To run a `SELECT` query any implementation of [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
can be used to initialize the `SparqlHttp` client object.

In the browser, the native implementation would be used. RunKit runs nodejs
and thus [isomorphic-fetch](https://npm.im/isomorphic-fetch), [node-fetch](https://npm.im/node-fetch)
or similar can be used.

<run-kit>

```js
const SparqlHttp = require('sparql-http-client')
const { SELECT } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { dbo, foaf } = require('@tpluscode/rdf-ns-builders') 
const fetch = require('isomorphic-fetch')

const client = new SparqlHttp({
  endpointUrl: 'http://dbpedia.org/sparql',
  fetch,
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
    .execute(client)

results.map(r => ({
    person: r.person.value,
    name: r.name.value,
    birth: r.birth.value,
    death: r.death.value,
}))
```

</run-kit>

### CONSTRUCT/DESCRIBE

To simplify the retrieval of a graph result, such as those returned by
`CONSTRUCT` and `DESCRIBE` queries, a specialized `fetch` instance can be used.

The packages `@rdfjs/fetch` and `@rdfjs/fetch-lite` extend the `Response` object
with functions to parse the response body and return either an  
[RDF/JS Dataset](https://rdf.js.org/dataset-spec/#datasetcore-interface).
or an [RDF/JS Stream](https://rdf.js.org/stream-spec/#stream-interface).

The former is better suited for node environment as it immediately loads a
set of [common RDF parsers](https://npm.im/@rdfjs/formats-common). The latter
has to be manually set up and allows reducing of bundle size in the case of
web applications.

<run-kit>

```js
const SparqlHttp = require('sparql-http-client')
const { DESCRIBE } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { dbo } = require('@tpluscode/rdf-ns-builders') 
const { turtle } = require('@tpluscode/rdf-string')
const fetch = require('@rdfjs/fetch')

const client = new SparqlHttp({
  endpointUrl: 'http://dbpedia.org/sparql',
  fetch,
})

const person = variable('person')

const dataset = await DESCRIBE`${person}`
    .WHERE`
        ${person} ${dbo.birthPlace} <http://dbpedia.org/resource/Berlin> .
    `
    .LIMIT(1)
    .execute(client)
    .then(results => results.dataset())

turtle`${dataset}`.toString()
```

</run-kit>
