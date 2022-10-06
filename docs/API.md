# KustoTrender API Reference

**kustotrender** is a collection of components for data visualization and analytics.

It includes optional modules that may be used independently of [Azure Data Explorer](https://learn.microsoft.com/en-us/azure/data-explorer/) as well as tools for calling the [Azure Data Explorer APIs](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/api/):

* [KustoTrender.ux](UX.md) that works with generic JSON to render visual analytics using charts and graphs

* [KustoClient](ADX.md) which comprises a set of utilities for querying Azure Data Explorer APIs directly from the browser

* Helper classes that simplify usage throughout

## KustoTrender.ux

[KustoTrender.ux](UX.md) is a standalone module for data visualization and analytics. It can be used to build graphs and charts using generic JSON as well as JSON returned from the Azure Data Explorer Client directly.

**KustoTrender.ux** is formally composed of the following items:

* [Components](UX.md#components) for visualizing data and building a variety of charts

* [Classes](UX.md#classes) for abstracting common operations, queries, and common objects

* [Functions](UX.md#functions) for transforming data into a suitable chartable shape

## KustoTrender.ADXClient


[KustoTrender.ADXClient](ADX.md) is a set of utilities for querying the Azure Data Explorer APIs directly from a browser or web client.

**KustoTrender.ADXClient** consists in several functions to abstract common operations made to the Azure Data Explorer Query APIs.

## See also

* The [Azure Data Explorer documentation](https://learn.microsoft.com/en-us/azure/data-explorer/)

* The [Kusto Query Language documentation](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/)

* Hosted **kustoclient** [client samples](https://kustotrender.z6.web.core.windows.net)
