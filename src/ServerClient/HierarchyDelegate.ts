import { ADXTrenderClient, PathSearchPayload } from "./ADXTrenderClient";

export class HierarchyDelegate {
  public client: ADXTrenderClient;

  constructor(client: ADXTrenderClient) {
    this.client = client;
  }

  async getInstances() {
    console.log("getInstances");
    throw "";
    return {
      instances: [
        {
          typeId: "1be09af9-f089-4d6b-9f0b-48018b5f7393",
          timeSeriesId: ["20.102.78.88/46101"],
          name: "Points.5k-4.20k_611_PISim_1220",
          description: "",
          hierarchyIds: ["72df205e-c0fd-44c9-9fa8-c62ba720de6c"],
          instanceFields: {
            Low: "0",
            High: "100",
            PointSource: "",
            DigitalSet: "",
            EngUnits: "",
            PointType: "Float64",
            Description: "",
            L1: "I/O Model",
            L2: "fusion-geoscada",
          },
        },
      ],
    };
  }

  async getTimeSeriesTypes() {
    console.log("getTimeSeriesTypes");
    return [
      {
        id: "1be09af9-f089-4d6b-9f0b-48018b5f7393",
        name: "DefaultType",
        description: "Default type",
        variables: {
          EventCount: {
            kind: "aggregate",
            aggregation: {
              tsx: "count()",
            },
          },
        },
      },
    ];
  }

  async getHierarchies() {
    return (await this.client.getHierarchies()).map((h) => ({
      name: h.HierarchyName,
      id: h.HierarchyId,
    }));
  }

  async getInstancesSuggestions(text: string) {
    console.log("getInstancesSuggestions", text);
    return [
      {
        searchString: "f39ef799-eaa3-4019-81ef-a939b6921728",
        highlightedSearchString:
          "f39ef799-<hit>e</hit>aa3-4019-81ef-a939b6921728",
      },
      {
        searchString: "e65c8fc5-65ac-4e15-9d0d-2682b752d42d",
        highlightedSearchString:
          "<hit>e</hit>65c8fc5-65ac-4e15-9d0d-2682b752d42d",
      },
      {
        searchString: "1e3218af-d438-4c8c-835b-e85406ff7772",
        highlightedSearchString:
          "1e3218af-d438-4c8c-835b-<hit>e</hit>85406ff7772",
      },
      {
        searchString: "ae7bf854-5eb4-4aa8-88b4-ed8b5ebfbbda",
        highlightedSearchString:
          "ae7bf854-5eb4-4aa8-88b4-<hit>e</hit>d8b5ebfbbda",
      },
      {
        searchString: "e3c5a2f1-b72b-4781-afbb-1f902c9ee255",
        highlightedSearchString:
          "<hit>e</hit>3c5a2f1-b72b-4781-afbb-1f902c9ee255",
      },
      {
        searchString: "ec9ab423-7d67-418a-b845-1ea74b923baa",
        highlightedSearchString:
          "<hit>e</hit>c9ab423-7d67-418a-b845-1ea74b923baa",
      },
      {
        searchString: "7754d662-e0e7-417d-b358-c0ac1e374f7d",
        highlightedSearchString:
          "7754d662-<hit>e</hit>0e7-417d-b358-c0ac1e374f7d",
      },
      {
        searchString: "06d862a1-ee99-40ca-94c3-83659ad8add0",
        highlightedSearchString:
          "06d862a1-<hit>e</hit>e99-40ca-94c3-83659ad8add0",
      },
      {
        searchString: "bd724880-9a6b-47c5-8143-e65ab02d8cdf",
        highlightedSearchString:
          "bd724880-9a6b-47c5-8143-<hit>e</hit>65ab02d8cdf",
      },
      {
        searchString: "2d6ac321-d921-41f5-a18f-ecbbaee005af",
        highlightedSearchString:
          "2d6ac321-d921-41f5-a18f-<hit>e</hit>cbbaee005af",
      },
    ];
  }

  async getInstancesPathSearch(hierarchy: string, payload: PathSearchPayload) {
    console.log("getInstancesPathSearch", payload);

    hierarchy = "72df205e-c0fd-44c9-9fa8-c62ba720de6c";

    const result = await this.client.getHierarchyLevel(hierarchy, payload);
    console.log(result);
    const out = {
      hierarchyNodes: {
        hits: result.children.map((child) => ({
          name: child.ChildName,
          cumulativeInstanceCount: child.TagCount,
        })),

        hitCount: result.children.length,
      },
      instances: {
        hits: result.tags.map((tag) => ({
          timeSeriesId: [tag.TimeSeriesId],
          typeId: "1be09af9-f089-4d6b-9f0b-48018b5f7393", // ⛳️
          hierarchyIds: ["33d72529-dd73-4c31-93d8-ae4e6cb5605d"],
          highlights: {
            timeSeriesId: [tag.TimeSeriesId],
            typeName: "TurbineSensor",
            name: "",
            description: "ContosoFarm1W6_GenPower1",
            hierarchyIds: ["33d72529-dd73-4c31-93d8-ae4e6cb5605d"],
            hierarchyNames: ["Contoso WindFarm Hierarchy"],
            instanceFieldNames: ["Name", "Plant", "Unit", "System"],
            instanceFieldValues: [
              "ActivePower",
              "Contoso Plant 1",
              "W6",
              "Generator System",
            ],
          },
        })),
        hitCount: result.tags.length,
      },
    };

    console.log(out);

    return out;

    /*

    // first call


    // second call

    path	[…]
      0	"Contoso WindFarm Hierarchy"

    Traverse("{hierarchyId}", 1) | distinct current_level_value

    // third call

    path	[…]
      0	"Contoso WindFarm Hierarchy"
      2	"Plant 1"

    Traverse("{hierarchyId}", 1) | distinct current_level_value

    // later

    {
      "searchString": "",
      "path": [
        "Contoso WindFarm Hierarchy",
        "Contoso Plant 1",
        "W6",
        "Gearbox System",
        "GearboxOilLevel"
      ],
      "instances": {
        "recursive": false,
        "sort": {
          "by": "DisplayName"
        },
        "highlights": true,
        "pageSize": 10
      },
      "hierarchies": {
        "expand": {
          "kind": "OneLevel"
        },
        "sort": {
          "by": "Name"
        },
        "pageSize": 10
      }
    }

    */
    return {
      hierarchyNodes: {
        hits: [
          { name: "Contoso WindFarm Hierarchy", cumulativeInstanceCount: 80 },
        ],
        hitCount: 1,
      },
    };
  }

  async getInstancesSearch(text: string) {
    console.log("getInstancesSearch", text);
    return {
      instances: {
        hits: [
          {
            timeSeriesId: ["06d862a1-ee99-40ca-94c3-83659ad8add0"],
            typeId: "f325dd8f-cabd-4c4b-a092-9e592aaba440",
            hierarchyIds: ["33d72529-dd73-4c31-93d8-ae4e6cb5605d"],
            highlights: {
              timeSeriesId: [
                "<hit>06d862a1</hit>-<hit>ee99</hit>-<hit>40ca</hit>-<hit>94c3</hit>-<hit>83659ad8add0</hit>",
              ],
              typeName: "WeatherSensor",
              name: "",
              description: "ContosoFarm1W6_WindSpeed1",
              hierarchyIds: ["33d72529-dd73-4c31-93d8-ae4e6cb5605d"],
              hierarchyNames: ["Contoso WindFarm Hierarchy"],
              instanceFieldNames: ["Name", "Plant", "Unit", "System"],
              instanceFieldValues: [
                "WindSpeed",
                "Contoso Plant 1",
                "W6",
                "Weather System",
              ],
            },
          },
        ],
        hitCount: 1,
      },
    };
  }

  /*
{
  "searchString": "",
  "path": [],
  "instances": {
    "recursive": false,
    "sort": {
      "by": "DisplayName"
    },
    "highlights": true,
    "pageSize": 10
  },
  "hierarchies": {
    "expand": {
      "kind": "OneLevel"
    },
    "sort": {
      "by": "Name"
    },
    "pageSize": 10
  }
}
  */
}
