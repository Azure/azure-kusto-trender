# KustoTrender API Reference

**kustotrender** is a collection of components for data visualization and analytics.

It includes optional modules that may be used independently of [Azure Time Series Insights](https://docs.microsoft.com/azure/time-series-insights/) as well as tools for calling the [Azure Time Series Insights Query APIs](https://docs.microsoft.com/rest/api/time-series-insights/ga-query):

* [KustoTrender.ux](UX.md) that works with generic JSON to render visual analytics using charts and graphs

* [KustoClient](ADX.md) which comprises a set of utilities for querying Azure Data Explorer APIs directly from the browser

* Helper classes that simplify usage throughout

## KustoTrender.ux

[KustoTrender.ux](UX.md) is a standalone module for data visualization and analytics. It can be used to build graphs and charts using generic JSON as well as JSON returned from the Azure Time Series Insights APIs directly.

**KustoTrender.ux** is formally composed of the following items:

* [Components](UX.md#components) for visualizing data and building a variety of charts

* [Classes](UX.md#classes) for abstracting common operations, queries, and common objects

* [Functions](UX.md#functions) for transforming data into a suitable chartable shape

## KustoTrender.server


> **Warning**
> This class has been deprecated for ADX support. Please see [ADX.md](ADX.md) for more details.

[KustoTrender.server](Server.md) is a set of utilities for querying the Azure Time Series Insights APIs directly from a browser or web client.

**KustoTrender.server** consists in several [Functions](Server.md#functions) to abstract common operations made to the Azure Time Series Insights Query APIs.

## See also

* The [Azure Data Explorer documentation](https://learn.microsoft.com/en-us/azure/data-explorer/)

* The [Kusto Query Language documentation](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/)

* Hosted **kustoclient** [client samples](https://tsiclientsample.azurewebsites.net)
