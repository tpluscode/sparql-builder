# CONSTRUCT

Construct builder is similar to [`SELECT`](./SELECT.md) but the main difference is that instead of variables valid triple patterns must return from the string template.

<run-kit>

```js
const { CONSTRUCT } = require('@tpluscode/sparql-builder')
const { schema } = require('@tpluscode/rdf-ns-builders')
const { namedNode } = require('@rdfjs/data-model')

CONSTRUCT`?person ?p ?o`
    .FROM(namedNode('urn:graph:default'))
    .FROM().NAMED(namedNode('urn:graph:john'))
    .FROM().NAMED(namedNode('urn:graph:jane'))
    .WHERE`GRAPH ?g {
        ?person a ${schema.Person} .
        ?person ?p ?o .
    }`.build()
```

</run-kit>
