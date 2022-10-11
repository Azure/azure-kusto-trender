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

The example in the sample gallery rely on four fundamental items:

* An Azure Active Directory App
* A Kusto cluster
* Stored functions deployed on the cluster
* Sample data

This section covers the steps you need to take in order to run the Kusto-Trender on your Kusto environment.

1. [Create an Azure Application](#create-an-azure-application)
1. [Create a Kusto environment](#create-a-kusto-environment)
1. [Create the schema](#create-the-schema)
1. [Deploy helper functions](#deploy-helper-functions)
1. [Deploy sample data](#deploy-sample-data)

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

The functions in the sam

### Deploy helper functions

foo

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
