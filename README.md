# KustoTrender: The Azure Data Explorer JavaScript SDK


<a href="https://kustotrender.z6.web.core.windows.net"><img src="./pages/examples/images/ADX.svg" align="left" hspace="10" vspace="6" height="100px"></a>

The KustoTrender JavaScript SDK is a JavaScript library for Microsoft Azure Data Explorer, featuring components for data visualization and analytics, utilities for making calls directly to the KQL Cluster, and more.  **KustoTrender** also ships with an associated CSS file (which you must include using your preferred css linking method), which makes the components look great out of the box.


[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/azure-kusto-trender.svg)](https://badge.fury.io/js/azure-kusto-trender) 

## Resources

* [API Reference documentation](docs/API.md)
* [Product documentation](https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview)
* [Hosted KustoTrender samples](https://kustotrender.z6.web.core.windows.net)

## Installing

If you use npm, `npm install kustotrender`.

To import all of **KustoTrender** into an ES2015 application, import everything into a namespace, like so:

```js
import KustoTrender from "kustotrender";

// later, when you want a line chart
let kustoTrender = new KustoTrender();
let lineChart = new kustoTrender.ux.LineChart(document.getElementById('chart'));
```

You can also import components individually.  If you only need the LineChart, you can import it like so...

```js
import LineChart from 'kustotrender/LineChart'

// later when you want a line chart
let lineChart = new LineChart(document.getElementById('chart'));
```
Importing individual components can help significantly reduce your bundle size as they work better with tree shaking. This is the recommended approach if your app only consumes specific components.

To import the kustotrender stylesheet into an ES2015 application, import either `kustoTrender.css` or `kustoTrender.min.css`, like so...

```js
import 'kustotrender/kustoTrender.css' // Standard styles
import 'kustotrender/kustoTrender.min.css' // Minified styles
```

## How to run Trender on your Kusto

A Kusto-Trender experience ([Example 1](/pages/examples/withplatform/exploreeventspayg.html), [Example 2](/pages/examples/withplatform/basiccharts.html)) relies on the following fundamental items:

* An Azure Active Directory App
* A Kusto cluster
* Schema & stored functions deployed on the cluster
* Optional: Sample data / data pipeline

This section covers the steps you need to take in order to run the Kusto-Trender on your Kusto environment.

1. [Create an Azure Application](#create-an-azure-application)
1. [Create a Kusto environment](#create-a-kusto-environment)
1. [Create the schema](#create-the-schema)
1. Optional: [Deploy sample data](#deploy-sample-data)
1. Optional: Create a data pipeline

### Create an Azure Application

If your Trender needs to access Kusto using the credentials of the calling user, configure delegated permissions for your application registration. Please follow the following documentation:

1. [Create an Azure Active Directory application](https://learn.microsoft.com/azure/data-explorer/provision-azure-ad-app). It's not needed to create any certificate or secret.
1. [Configure delegated permissions for the application registration](https://learn.microsoft.com/azure/data-explorer/provision-azure-ad-app).
1. Optional: [grant admin consent](https://learn.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps#admin-consent) for the permissions of the app you created.

### Create a Kusto environment

Kusto is available in many incarnations nowadays:

* [Azure Data Explorer](https://learn.microsoft.com/azure/data-explorer/data-explorer-overview)
* [Azure Synapse Data Explorer](https://learn.microsoft.com/azure/synapse-analytics/data-explorer/data-explorer-overview)
* [MyFreeCluster](https://aka.ms/kustofree)

All of them are compatible with Kusto Trender. The one that does not come with any cost is [MyFreeCluster](https://aka.ms/kustofree). You'll be able to create a new cluster for you in seconds.

### Create the schema

Once you have a working Kusto, you want to deploy the schema. You can find the schema that fuels the examples [here](kusto/trender-schema.kql). It's a small script which creates a couple of tables and functions. Just execute it in the scope of the database you like to use.

The following tables are created by the script.

#### Timeseries

"The raw timeseries data"

<!-- csl: https://help.kusto.windows.net/Trender -->
```kusto
Timeseries
| take 10
```

| TimeseriesId | Timestamp | Value |
|---|---| ---|
| 939d52f1-cba7-48bb-87cb-d8e5d9050a73 | 2017-05-01 00:00:00.0000000 | 0,321766886722178 |
| 011523e8-5ab6-46ec-9a50-4ac3a6488f8c | 2017-05-01 00:00:00.0000000 | 0,00480370965876755 |
| bddbab16-fab5-4d59-8353-f35b58866e53 | 2017-05-01 00:00:00.0000000 | 0,84581159990962 |
| 98ee0da5-662c-44c7-b0d0-d5bf8719d570 | 2017-05-01 00:00:00.0000000 | 28,0770391031749 |
| c98fa24b-8353-46f0-b32a-135d9e04a2f0 | 2017-05-01 00:00:00.0000000 | 0,809812494485808 |
| 6052949f-d73c-4b60-a7bf-80a18053b7fc | 2017-05-01 00:00:00.0000000 | 0,00357295958308354 |
| b19aa5c4-5d4f-4a05-8e1c-8aacc5c8336d | 2017-05-01 00:00:00.0000000 | 0,823791382518091 |
| 97fe6858-1f53-4bc8-8cfd-824887a0de54 | 2017-05-01 00:00:00.0000000 | 28,9829603183781 |
| a125897d-b7ef-4992-97ab-4bfa5838d78a | 2017-05-01 00:00:00.0000000 | 0,159779034867988 |
| 687f97ef-268e-4daf-932c-181f793d0e59 | 2017-05-01 00:00:00.0000000 | 0,00468126565053374 |

#### TimeseriesMetadata

"The timeseries metadata"

#### TimeseriesHierarchy

"The timeseries hierarchy")

### Deploy sample data

foo

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
