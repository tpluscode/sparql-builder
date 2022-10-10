# DESCRIBE

Reference: https://www.w3.org/TR/sparql11-query/#describe

## Typical usage

<run-kit>

```js
const { DESCRIBE } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdf-esm/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

DESCRIBE`${person}`
  .WHERE`
    ?person a ${schema.Person}
  `
  .build()
```

</run-kit>

## URIs, Without `WHERE'

<run-kit>

```js
const { DESCRIBE } = require('@tpluscode/sparql-builder')
const { namedNode } = require('@rdf-esm/data-model')

const person = namedNode('http://example.com/person')

DESCRIBE`${person}`.build()
```

</run-kit>
