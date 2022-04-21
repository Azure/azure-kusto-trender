import { ADXResponse, RawADXResponse } from "./ADXResponse";
type ADXTokenProvider = () => Promise<string>;

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
    try {
      response = await fetch(this.queryUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
      return;
    }

    await this.parseResponse(response);
  }

  async parseResponse(fetchResponse: Response) {
    let rawResponse: RawADXResponse = await fetchResponse.json();
    let data = new ADXResponse(rawResponse);

    console.log(data);
  }
}
