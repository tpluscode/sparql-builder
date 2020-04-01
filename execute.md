# Execute a SPARQL Query

It is possible to run queries with a simple [sparql-http-client][client] library.
It is a peer dependency so it must be installed explicitly.

```
npm i -S sparql-http-client
```

[client]: https://npm.im/sparql-http-client

## API

The query is executed by invoking an `execute` method of a query builder instance. It takes a `SparqlHttpClient` as first, required parameter and an optional second which is defined as:

```typescript
import { QueryOptions } from 'sparql-http-client'

type SparqlExecuteOptions = QueryOptions & {
    base?: string
}
```

In other words, the underlying HTTP fetch request can be full controlled by the `RequestInit` part and the optional `base` property can be set to be used as a `BASE` directive in the resulting SPARQL.

## DBpedia examples

The queries below are adapted from DBpedias [Online Access](https://wiki.dbpedia.org/OnlineAccess) examples.

### SELECT

<run-kit>

[select](examples/execute-select.js ':include')

</run-kit>

### CONSTRUCT/DESCRIBE

<run-kit>

[select](examples/execute-construct.js ':include')

</run-kit>
