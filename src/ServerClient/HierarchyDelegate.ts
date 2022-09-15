import { ADXResponse } from ".";
import {
  ADXTrenderClient,
  HierarchiesExpandKind,
  PathSearchPayload,
} from "./ADXTrenderClient";

interface HierachyLevel {
  hits: number;
  name: string;
  children: Record<string, HierachyLevel>;
}

function convertHierarchy(h: HierachyLevel) {
  return {
    name: h.name,
    cumulativeInstanceCount: h.hits,
    hierarchyNodes: {
      hits: Object.values(h.children).map(convertHierarchy),
      hitCount: h.children.length,
    },
  };
}

/**
 * A helper that wraps {@link ADXTrenderClient} to help with hierarchy navigation.
 * This class can be extended to modify the hierarchy component's behavior.
 */
export class HierarchyDelegate {
  public client: ADXTrenderClient;

  constructor(client: ADXTrenderClient) {
    this.client = client;
  }

  private typeId = "ADX-TYPE-ID";

  async getTimeSeriesTypes() {
    console.log("getTimeSeriesTypes");
    return [
      {
        id: this.typeId,
        name: "DefaultType",
        description: "Default type",
        variables: {
          EventCount: { kind: "aggregate", aggregation: { tsx: "count()" } },
        },
      },
    ];
  }

  async getHierarchies() {
    return (await this.client.getHierarchies()).map((h) => ({
      name: h.HierarchyName,
      id: h.HierarchyName,
    }));
  }

  async getInstancesSuggestions(text: string) {
    const result = await this.client.getSuggestions(text);
    return result.map((searchString) => ({ searchString }));
  }

  async getInstancesPathSearch(payload: PathSearchPayload) {

    var result = {
      children: [],
      tags: [],
    };

    if (
      payload.searchString &&
      payload.hierarchies?.expand?.kind == HierarchiesExpandKind.UntilChildren
    ) {
      const tableName = "TrenderHierarchySearch";
      const tagsTableName = "HierarchyTags";
      const query = `
      declare query_parameters(SearchString:string, Path: dynamic);
      GetPathToTag_Henningv2(Path, SearchString) | as ${tableName};
    `;
      // SearchTagsAtPath(Path, SearchString) | as ${tagsTableName};


      const result = await this.client.executeQuery(query, {
        parameters: {
          Path: `dynamic(${JSON.stringify(payload.path)})`,
          SearchString: payload.searchString,
        },
      });
      debugger

      const unfolded = result.unfoldTable<{
        TimeSeriesId: string;
        Path: string[];
      }>(result.getTable(tableName));

      const fullHierarchy: HierachyLevel = {
        hits: 1,
        name: "ROOT",
        children: {},
      };

      unfolded.forEach((hit) => {

        const path = hit.Path;

        var pointer = fullHierarchy;

        for (const element of payload.path) {
          if (path[0] == element) {
            path.shift();
          } else {
            break;
          }
        }

        path.forEach((level) => {
          if (level in pointer.children) {
            pointer.children[level].hits++;
          } else {
            pointer.children[level] = {
              hits: 1,
              name: level,
              children: {},
            };
          }
          pointer = pointer.children[level];
        });
      });

      console.trace()

      //const instances = result.unfoldTable<any>(result.getTable(tagsTableName));
      return {
        instances: {
          hits: unfolded.map((tag) => ({
            timeSeriesId: [tag.TimeSeriesId],
            typeId: this.typeId, // ⛳️
            hierarchyIds: [tag.Path[0]],
          })),
          hitCount: unfolded.length,
        },
        //hierarchyNodes: out.hierarchyNodes,
      };
    } else if (payload.searchString && payload.instances.recursive) {
      result.tags = await this.client.getChildrenTags(payload);
    } else if (payload.searchString) {
      console.log("level");
      result = {
        children: [],
        tags: await this.client.searchTagsAtPath(payload),
      };
    } else if (payload.searchString) {
      console.log("level");
      result = {
        children: [],
        tags: await this.client.searchTagsAtPath(payload),
      };
    } else {
      result = await this.client.getHierarchyLevel(payload);
    }

    const out = {
      hierarchyNodes: {
        hits: result.children.map((child) => ({
          name: child.Child,
          cumulativeInstanceCount: child.Count,
        })),

        hitCount: result.children.length,
      },
      instances: {
        hits: result.tags.map((tag) => {
          return {
            timeSeriesId: [tag.TimeseriesId],
            typeId: this.typeId, // ⛳️
            name: tag.DisplayName,
            highlights: {
              timeSeriesId: [tag.TimeseriesId],
              description: tag.Path ? tag.Path[tag.Path.length - 1] : undefined, // Use decription for the last path component
              name: tag.DisplayName,
            },
          }
        }),
        hitCount: result.tags.length,
      },
    };

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
}
