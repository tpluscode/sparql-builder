# ASK

Reference: https://www.w3.org/TR/sparql11-query/#ask

## Simple query with a `WHERE` clause

<run-kit>

```js
const { ASK } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

ASK`${person} a ${schema.Person}`.build()
```

</run-kit>
