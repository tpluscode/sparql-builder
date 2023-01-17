---
"@tpluscode/sparql-builder": patch
---

Add `prefixes` parameter to `build` so ad-hoc prefixes can be applied to a query 
Re-export `prefixes` where it's possible to [add prefixes globally](https://github.com/zazuko/rdf-vocabularies#project-specific-prefixes) 
(re #81)
