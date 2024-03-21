> # @tpluscode/sparql-builder ![Test](https://github.com/tpluscode/sparql-builder/workflows/Test/badge.svg) [![codecov](https://codecov.io/gh/tpluscode/sparql-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/tpluscode/sparql-builder) [![npm version](https://badge.fury.io/js/%40tpluscode%2Fsparql-builder.svg)](https://badge.fury.io/js/%40tpluscode%2Fsparql-builder)

Simple library to create SPARQL queries with tagged ES Template Strings

## How is it different from simply string concatenation/plain templates?

1. Focuses on graph patterns. No need to remember exact syntax
1. Still looks like SPARQL, having a familiar structure and little glue code
1. Has the IDE provide syntactic hints of valid SPARQL keywords
1. Ensures correct formatting of terms (URI nodes, literals variables) via [@tpluscode/rdf-string](https://github.com/tpluscode/rdf-string)
1. Automatically shortens URIs with [`@zazuko/prefixes`](http://npm.im/@zazuko/prefixes)

## Installation

```
npm i -S @tpluscode/sparql-builder
```

To be able to execute queries against a remote endpoint install a peer
dependency:

```
npm i -S sparql-http-client
```

## Usage

### Build a SPARQL query string

```js
import rdf from '@zazuko/env'
import { SELECT } from '@tpluscode/sparql-builder'

const ex = rdf.namespace('http://example.com/')
const { foaf } = rdf.ns

/*
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?person ?name
    FROM <http://example.com/People>
    WHERE 
    {
      ?person a foaf:Person ;
              foaf:name ?name .
    }
*/
const person = rdf.variable('person')
const query = 
  SELECT`${person} ?name`
  .FROM(ex.People)
  .WHERE`
    ${person} a ${foaf.Person} ; 
              ${foaf.name} ?name .
  `.build()
```

### Executing a query

Using [`sparql-http-client`](https://github.com/zazuko/sparql-http-client)

```js
import rdf from '@zazuko/env'
import SparqlHttp from 'sparql-http-client'
import { ASK } from '@tpluscode/sparql-builder'

const { dbo } = rdf.ns
const dbr = rdf.namespace('http://dbpedia.org/resource/')

const client = new SparqlHttp({
  factory: rdf,
  endpointUrl: 'http://dbpedia.org/sparql',
})

const scoobyDoo = dbr('Scooby-Doo')

/*
    PREFIX dbo: <http://dbpedia.org/ontology/>

    ASK {
        <http://dbpedia.org/resource/Scooby-Doo> a dbo:Person .
    }
 */
ASK`${scoobyDoo} a ${dbo.Person}`
  .execute(client)
  .then(isScoobyAPerson => {
    // Fun fact: DBpedia seems to claim that Scooby-Doo is indeed a Person...
    return isScoobyAPerson
  })
```

## Running examples

The example in [`docs/examples`](docs/examples) can be executed locally. To do so, first replace the package import to point to the repository root.

```diff
-const { /* */ } = require('@tpluscode/sparql-builder')
+const { /* */ } = require('../..')
```

Then simply `npm run example`.
