# ADX API Reference

The ADX classes within this repository contain helper classes to query using KQL and to provide data to the components originally designed for TSI.

This package contains the dollowing:

* **ADXClient** A simple class to query ADX using KQL, and helpers to manipulate the returned data

* **ADXTrenderClient** A subclass of ADXClient witth trender-components specific methods

* **HierarchyDelegate** A class designed to bridge ADX hierarchies with the TSI Hierarchy Navigation component

## ADXClient

The ADXClient class is a simple helper to query ADX clusters using KQL. 

```ts
const cluster = new ADX.ADXClient(
  "https://{your_cluster}.eastus.kusto.windows.net",
  tokenProvider,
  "{your_database_name}"
);

```

Initialize a client by providing the ADX instance URI, a token provider, and the database name to query.

### Token provider

The token provider is a simple function of type `() => Promise<string>`. It will be called before each query to get the token to use. The query will not execute until the promise resolves with a token string value.

The ADXClient does not perform any kind of caching or lifecycle management on tokens, so make sure the token is valid before returning it.

With MSAL, you can acquire the token with:

```ts
const tokenProvider = async () => {
  // This is a basic example, refer to MSAL documentation to handle every case
  const result = await authClient.acquireTokenSilent(loginRequestConfig);
  return result.idToken
}
```

With ADAL, you can simply use the return value of `authContext.acquireToken(...)` as your token provider.

### Querying

To execute a query, simply call the `executeQuery` function:

```ts
const query = "print 'Hello!'";
const result = await cluster.executeQuery(query);
console.log(result);
```

The query function returns a promise. You can use `await` to get the results in an `async` context, or you can use `.then`:

```ts
const query = "print 'Hello!'";
cluster.executeQuery(query).then((result) => {
  console.log(result);
})
```

In both cases, `result` will be of type `ADXResponse`.

### ADXResponse

`ADXResponse` is a wrapper type around the raw results from a KQL query. It provides helper functions to find and transform the data.

```ts
const query = "print message='Hello!' | as MyTable";
const result = await cluster.executeQuery(query);

result.getPrimaryTables();
// Returns the results to your query, filtering ADX Metadata

const myRawTable = result.getTable("MyTable");
// Returns the named table

const object = result.unfoldTable(myRawTable);
// Transform the raw table into a keyed JS object

console.log(object[0].message);
// Prints "Hello!"
```

### Unfolding

In the previous example, the `myRawTable` variable contains the following:

```json
{
  "FrameType": "DataTable",
  "TableId": 1,
  "TableKind": "PrimaryResult",
  "TableName": "MyTable",
  "Columns": [
    {
      "ColumnName": "message",
      "ColumnType": "string"
    }
  ],
  "Rows": [
    [
      "Hello!"
    ]
  ]
}
```

ADX Response comes with a function to "unfold" the data, meaning it will pair rows and columns to make an array of keyed objects. In our example, you would get the following:

```json
[
  {
    "message": "Hello!"
  }
]
```

While convenient, unfolding happens entirely in the browser and loops over the data and columns, meaning it can significantly slow down as the returned data grows bigger. 

### Query Parameters

To keep your query safe and avoid injection, `ADXClient` supports query parameters.

```ts
const query = `
  declare query_parameters(Name: string);
  print strcat('Hello ', Name, );
`;

const result = await this.executeQuery(query, {
  parameters: {
    Name: "Ivan",
  },
});
```

To pass `dynamic` parameters, you must provide them in KQL-ready format. An easy way to do that is by using the browser's `JSON.stringify`:

```ts
const cities = ["Paris", "Chicago", "Geneva", "Toronto", "Los Angeles"];

const query = `
  declare query_parameters(Cities: dynamic);
  print strcat_array(Cities, ', ');
`;

const result = await this.executeQuery(query, {
  parameters: {
    Cities: `dynamic(${ JSON.stringify(cities) })`,
  },
});
```

Note that the JSON is still wrapped with `dynamic()`.

_See Also:_ [KQL Documentation - Query parameters declaration statement](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/queryparametersstatement?pivots=azuredataexplorer)

### Query Properties

By default, `ADXClient` only supports parameters as outlined in the previous section. However, any additional property passed to the second argument of `execureQuery` will be passed as is to Kusto.

```ts
await cluster.executeQuery(query, {
  request_description: "A polite greeting"
});
```


_See Also:_ [KQL Documentation - Request properties and ClientRequestProperties](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/request-properties)

## ADXTrenderClient

The `ADXTrenderClient` class is a subclass of `ADXClient` built to add functions specific to this charting library.

All methods within the Trender Client class are documented and return chart-specific formats. If you intend to use the data anywhere else, you might want to copy the raw query and use a simple `ADXClient` to execute it.

To get started, instanciate the Trender Client just like any `ADXClient`:

```ts
const cluster = new ADX.ADXTrenderClient(
  "https://{your_cluster}.eastus.kusto.windows.net",
  tokenProvider,
  "{your_database_name}"
);
```

To function properly, `ADXTrenderClient` requires the ADX Trender KQL Functions to be installed in the database you are pointing to. 

Then, call any function to get data in a format that is ready to be used with the UI components:

```ts
var tsiClient = new TsiClient();
var availability = new tsiClient.ux.AvailabilityChart(
  document.getElementById("availability")
);

const result = await cluster.getAvailability();

availability.render(
  result.availability,
  { legend: "hidden", theme: "dark", color: "royalblue" },
  {
    range: result.range,
    intervalSize: "1h",
  }
);
```

## HierarchyDelegate

This class was built to provide a connector between the Hierarchy Navigation UI component and the `ADXTrenderClient`. If you would like to use the Hierarchy component without ADX, simply subclass `HierarchyDelegate` and provide your own implementation of each method.

`HierarchyDelegate` expects an `ADXTrenderClient` to be configured and passed at creation:

```ts
var delegate = new ADX.HierarchyDelegate(cluster)

const hierarchy = new tsiClient.ux.HierarchyNavigation(document.getElementById('hierarchyNav'));

hierarchy.render(delegate, {}, {}));
```



## TypeScript

All classes within the ADX client are strongly typed.

When unfolding data, the client doesn't know about the columns and therefore cannot provide type checking on the output. To provide your own type definition, `unfoldTable` can be given a generic type:

```ts
interface Greeting {
  message: string
}

const query = "print message='Hello!' | as MyTable";
const result = await cluster.executeQuery(query);

result.getPrimaryTables();
// Returns the results to your query, filtering ADX Metadata

const myRawTable = result.getTable("MyTable");
// Returns the named table

const object = result.unfoldTable<Greeting>(myRawTable);

// `object` has type `Greeting[]`
// `object[0]` has type `Greeting`
// `object[0].message` has type `string`
```