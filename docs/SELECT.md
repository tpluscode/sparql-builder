# SELECT

Reference: https://www.w3.org/TR/sparql11-query/#select

## Simple SELECT * query

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

SELECT.ALL.WHERE`${person} a ${schema.Person}`.build()
```

</run-kit>

## `SELECT DISTINCT`

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')

SELECT.DISTINCT`?person`.WHERE`?person a ${schema.Person}`.build()
```

</run-kit>

## `SELECT REDUCED`

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')

SELECT.REDUCED`?person`.WHERE`?person a ${schema.Person}`.build()
```

</run-kit>

## `FROM (NAMED)`

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')
const { namedNode } = require('@rdfjs/data-model')

SELECT`?person`
    .FROM(namedNode('urn:graph:default'))
    .FROM().NAMED(namedNode('urn:graph:john'))
    .FROM().NAMED(namedNode('urn:graph:jane'))
    .WHERE`GRAPH ?g {
        ?person a ${schema.Person}
    }`.build()
```

</run-kit>
