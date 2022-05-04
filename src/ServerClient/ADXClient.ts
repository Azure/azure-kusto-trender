import { ADXResponse, RawADXResponse } from "./ADXResponse";
type ADXTokenProvider = () => Promise<string>;

/**
 * A basic JS wrapper for the ADX Kusto REST Query APIs.
 *
 * @remarks
 * This class is designed to support the TSI Trender library, not to
 * provide a fully featured ADX client.
 *
 * @see {@link https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/rest/ API Documentation}
 */

export class ADXClient {
  public clusterUrl: string;
  public database: string;
  public tokenProvider: ADXTokenProvider;

  constructor(
    clusterUrl: string,
    tokenProvider: ADXTokenProvider,
    database: string
  ) {
    this.clusterUrl = clusterUrl;
    this.database = database;
    this.tokenProvider = tokenProvider;
  }

  public get queryUrl() {
    return `${this.clusterUrl}/v2/rest/query`;
  }
  async executeQuery(query: string) {
    const token = await this.tokenProvider();
    let response: Response;

    const body = {
      db: this.database,
      csl: query,
      properties: "",
    };

    response = await fetch(this.queryUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw Error(`Query call failed with status: ${response.status}`);
    }

    return this.parseResponse(response);
  }

  private async parseResponse(fetchResponse: Response) {
    let rawResponse: RawADXResponse = await fetchResponse.json();
    let data = new ADXResponse(rawResponse);

    return data;
  }
}
