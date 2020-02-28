# Modifiers

Reference: https://www.w3.org/TR/sparql11-query/#solutionModifiers

## LIMIT/OFFSET

https://www.w3.org/TR/sparql11-query/#modOffset

<run-kit>

```js
const { CONSTRUCT } = require('@tpluscode/sparql-builder')
const { variable } = require('@rdfjs/data-model')
const { schema } = require('@tpluscode/rdf-ns-builders')

const person = variable('person')

CONSTRUCT`${person} a ${schema.Person}`.LIMIT(30).build()
```

</run-kit>
