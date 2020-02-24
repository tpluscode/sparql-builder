# SELECT

Reference: https://www.w3.org/TR/sparql11-query/#select

## Simple SELECT query

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

SELECT`${person} a ${schema.Person}`.build()
```

</run-kit>

## `SELECT DISTINCT`

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')

SELECT.DISTINCT`?person a ${schema.Person}`.build()
```

</run-kit>

## `SELECT REDUCED`

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')

SELECT.REDUCED`?person a ${schema.Person}`.build()
```

</run-kit>
