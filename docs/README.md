# About

This package helps create SPARQL Queries/Updates in JavaScript by doing a
little magic with ES Strings Templates.

## Installation

```
npm i -S @tpluscode/sparql-builder
```

## What it can do?

* Provides an API which looks like SPARQL
* Uses [@tpluscode/rdf-string](https://github.com/tpluscode/rdf-string) to correctly
* Shortens URIs from common vocabularies and introduces `PREFIX` statements
* Execute queries against remote SPARQL endpoint

## What it does not do?

* Provide API for keywords other than top-level (such as `OPTIONAL` or `GRAPH`)
* Verify syntax
* Process the constant parts (ie. not the static parts of string templates)

## Compatibility

Package as both commonjs and ES modules, the package can be used in node as
well as browsers.
