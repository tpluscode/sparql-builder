# Query prologue

The builder automatically handles interpolated named nodes and extracts their namespace into
the list of prefixes. However, it may be desired to insert additional contents at the beginning
of a query, such a comment, base URL or additional prefixes, such as modifiers that AllegroGraph
uses.

## Typical usage

<run-kit>

```js
const { DESCRIBE } = require('@tpluscode/sparql-builder')
const { variable, namedNode } = require('@rdf-esm/data-model')
const namespace = require('@rdf-esm/namespace@0.5.0')

const ns = namespace('http://example.com/')
const person = variable('person')

DESCRIBE`${person}`
  .WHERE`
    ?person a <Person>
  `
  .prologue`#pragma describe.strategy cbd`
  .prologue`BASE ${ns()}`
  .build()
```

</run-kit>
