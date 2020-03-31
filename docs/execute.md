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

To run a `SELECT` query any implementation of [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
can be used to initialize the `SparqlHttp` client object.

In the browser, the native implementation would be used. RunKit runs nodejs
and thus [isomorphic-fetch](https://npm.im/isomorphic-fetch), [node-fetch](https://npm.im/node-fetch)
or similar can be used.

<run-kit>

[select](examples/execute-select.js ':include')

</run-kit>

### CONSTRUCT/DESCRIBE

To simplify the retrieval of a graph result, such as those returned by
`CONSTRUCT` and `DESCRIBE` queries, a specialized `fetch` instance can be used.

The packages `@rdfjs/fetch` and `@rdfjs/fetch-lite` extend the `Response` object
with functions to parse the response body and return either an  
[RDF/JS Dataset](https://rdf.js.org/dataset-spec/#datasetcore-interface).
or an [RDF/JS Stream](https://rdf.js.org/stream-spec/#stream-interface).

The former is better suited for node environment as it immediately loads a
set of [common RDF parsers](https://npm.im/@rdfjs/formats-common). The latter
has to be manually set up and allows reducing of bundle size in the case of
web applications.

<run-kit>

[select](examples/execute-construct.js ':include')

</run-kit>
