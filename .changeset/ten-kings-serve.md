---
"@tpluscode/sparql-builder": major
---

Updated `sparql-http-client` to v3

The `.execute` method now takes an instance of client and not the `query` object. Also, since the new client does not return a promise from methods which return streams, `await` is no longer necessary
