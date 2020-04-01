# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.1](https://github.com/tpluscode/ts-template/compare/v0.3.0...v0.3.1) (2020-04-01)


### Bug Fixes

* parameters of execute were not correctly inferred ([87ed666](https://github.com/tpluscode/ts-template/commit/87ed666a853a46adc08eba33ee8eaf9dddc38080))

## [0.3.0](https://github.com/tpluscode/ts-template/compare/v0.2.2...v0.3.0) (2020-04-01)


### ⚠ BREAKING CHANGES

* changes the signature of execute method

### Features

* update to sparql-http-client-2 ([9953317](https://github.com/tpluscode/ts-template/commit/99533173972d87a1ca4b38d98cdf9f6fa9d30dfc))

### [0.2.2](https://github.com/tpluscode/ts-template/compare/v0.2.1...v0.2.2) (2020-03-02)


### Bug Fixes

* **execute:** incomplete export prevented the BASE from being applied ([7f301a5](https://github.com/tpluscode/ts-template/commit/7f301a51fc23999701abd4fa6e136b473f82911c))
* **execute:** the build was not actually called when executing ([437a749](https://github.com/tpluscode/ts-template/commit/437a749580f4154c37768dd203402d9ceadb223b))

### [0.2.1](https://github.com/tpluscode/ts-template/compare/v0.2.0...v0.2.1) (2020-03-02)


### Bug Fixes

* it's impossible to use BASE with execute ([2c43d2b](https://github.com/tpluscode/ts-template/commit/2c43d2bb110fb5c171c2497af11ba1108453559b))

## [0.2.0](https://github.com/tpluscode/ts-template/compare/v0.1.2...v0.2.0) (2020-03-02)


### ⚠ BREAKING CHANGES

* will potentially break if `SparqlQuery<>` was imported and not only inferred

### Bug Fixes

* refactor execute to return the correct Response type ([928cdbe](https://github.com/tpluscode/ts-template/commit/928cdbe9c3e841b5546e128706df5f708a3d16e6))

### [0.1.2](https://github.com/tpluscode/ts-template/compare/v0.1.1...v0.1.2) (2020-02-28)


### Bug Fixes

* it was impossible to interpolate another (sub-)query ([a060113](https://github.com/tpluscode/ts-template/commit/a060113c5969c2b63aed716dd4ac0eff4b61af4a))

### [0.1.1](https://github.com/tpluscode/ts-template/compare/v0.1.0...v0.1.1) (2020-02-25)


### Bug Fixes

* the ORDER BY clause must come before LIMIT/OFFSET ([80f77c6](https://github.com/tpluscode/ts-template/commit/80f77c648821876281665cd59aa8fcb18471f3d5))

## [0.1.0](https://github.com/tpluscode/ts-template/compare/v0.0.10...v0.1.0) (2020-02-24)


### ⚠ BREAKING CHANGES

* CONSTRUCT/DESCRIBE now return Response and not a Stream

### Features

* **select:** support for ORDER BY ([6841709](https://github.com/tpluscode/ts-template/commit/68417094b7f9d4b9686efb553d6738958bb491cb))


* change the graph query API ([ccfe4d6](https://github.com/tpluscode/ts-template/commit/ccfe4d62e71b2141a4f7432c1e5ebd18fec06bde))

### [0.0.10](https://github.com/tpluscode/ts-template/compare/v0.0.9...v0.0.10) (2020-02-24)


### Bug Fixes

* base was not applied to nested templates ([9ca4bea](https://github.com/tpluscode/ts-template/commit/9ca4bea68b3d93741a3911fa8257497a1925df27))

### [0.0.9](https://github.com/tpluscode/ts-template/compare/v0.0.8...v0.0.9) (2020-02-24)

### [0.0.8](https://github.com/tpluscode/ts-template/compare/v0.0.7...v0.0.8) (2020-02-24)


### Features

* support LIMIT/OFFSET in SPARQL Queries ([a52cc02](https://github.com/tpluscode/ts-template/commit/a52cc0275d8b9ac175e13216926f1a563e69a2fc))
* **select:** support REDUCED and DISTINCT ([e3987e8](https://github.com/tpluscode/ts-template/commit/e3987e82d5e633db919e842149f06e690ebb67bd))

### [0.0.7](https://github.com/tpluscode/ts-template/compare/v0.0.6...v0.0.7) (2020-02-23)


### Bug Fixes

* missing question marks when interpolating variables ([94e590d](https://github.com/tpluscode/ts-template/commit/94e590daf205af3c01aa7a8e8c9ca430758181e2))

### [0.0.6](https://github.com/tpluscode/ts-template/compare/v0.0.5...v0.0.6) (2020-02-23)

### [0.0.5](https://github.com/tpluscode/ts-template/compare/v0.0.4...v0.0.5) (2020-02-23)

### [0.0.4](https://github.com/tpluscode/ts-template/compare/v0.0.3...v0.0.4) (2020-02-23)

### [0.0.3](https://github.com/tpluscode/ts-template/compare/v0.0.2...v0.0.3) (2020-02-23)

### [0.0.2](https://github.com/tpluscode/ts-template/compare/v0.0.1...v0.0.2) (2020-02-23)


### Features

* **delete:** chain multiple INSERT and DELETE calls ([d5659dc](https://github.com/tpluscode/ts-template/commit/d5659dc26829eb03b60928c872ee12b54f593abb))
* **delete:** chaining multiple DATA calls ([c1d3c4c](https://github.com/tpluscode/ts-template/commit/c1d3c4cd9c507d56438f23175a05c2184140886d))
* **delete:** support DELETE..WHERE updates ([6d8dc1f](https://github.com/tpluscode/ts-template/commit/6d8dc1f17a04940ae9a7eca2b5c15c1c53e902d0))
* **insert:** chain multiple INSERT calls ([cc79fed](https://github.com/tpluscode/ts-template/commit/cc79fedf063615dbd0e1da1bd12e7186ac835913))
* **insert:** chaining multiple DATA calls ([60d2b50](https://github.com/tpluscode/ts-template/commit/60d2b50d612a5827bafb0e05bad5c4b3660adc47))
* **insert:** support INSERT..WHERE updates ([e8d254b](https://github.com/tpluscode/ts-template/commit/e8d254b17442aa689dbccd99e3c98adbb44f38de))
* **where:** chaining multiple WHERE calls ([ca88d77](https://github.com/tpluscode/ts-template/commit/ca88d77b2aefcd9fcdc7761a03f29290d19b5678))

### 0.0.1 (2020-02-22)


### Features

* moved all existing code from data-cube-curation ([71c1212](https://github.com/tpluscode/ts-template/commit/71c121246c1a61b7b23ad723da31c920fb5af778))
