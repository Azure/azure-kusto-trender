# KustoTrender: The Azure Data Explorer JavaScript SDK


<a href="https://kustotrender.z6.web.core.windows.net"><img src="./pages/examples/images/ADX.svg" align="left" hspace="10" vspace="6" height="100px"></a>

The KustoTrender JavaScript SDK is a JavaScript library for Microsoft Azure Data Explorer, featuring components for data visualization and analytics, utilities for making calls directly to the KQL Cluster, and more.  **KustoTrender** also ships with an associated CSS file (which you must include using your preferred css linking method), which makes the components look great out of the box.


[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/kustotrender.svg)](https://badge.fury.io/js/kustotrender) 

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

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
