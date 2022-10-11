import { ADXResponse, RawADXResponse } from "./ADXResponse";
type ADXTokenProvider = () => Promise<string>;

declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

interface ADXQueryProperties {
  parameters: Record<string, unknown>;
}

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

  /**
   * Getter for the query rest endpoint Url
   */
  public get queryUrl() {
    return `${this.clusterUrl}/v2/rest/query`;
  }

  /**
   * Executes a KQL query against the configured ADX cluster.
   *
   * @param query - KQL query
   * @param properties - Optional
   * @returns A Promise with an ADXRespnse object
   */
  async executeQuery(query: string, properties?: ADXQueryProperties) {
    const token = await this.tokenProvider();
    let response: Response;

    const body = {
      db: this.database,
      csl: query,
      properties: {
        ...properties
      },
    };

    response = await fetch(this.queryUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-ms-client-request-id": `KTrender;${self.crypto.randomUUID()}`,
        "x-ms-app": "KustoTrender"
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
    return new ADXResponse(rawResponse);
  }
}
