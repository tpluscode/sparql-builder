# Expressions and operators

`@tpluscode/sparql-builder/expressions` exports some SPARQL function and expressions so that they are more easily incorporated into the constructed query.

## `IN`

Reference: https://www.w3.org/TR/sparql11-query/#func-in

<run-kit>

```js
const { SELECT } = require('@tpluscode/sparql-builder')
const { IN } = require('@tpluscode/sparql-builder/expressions')
const { schema } = require('@tpluscode/rdf-ns-builders')

const names = ['John', 'Jane']

SELECT.ALL.WHERE`
    ?person a ${schema.Person} ; ?person ${schema.name} ?name .
    
    FILTER (
      ?name ${IN(...names)}
    )
`.build()
```

</run-kit>
