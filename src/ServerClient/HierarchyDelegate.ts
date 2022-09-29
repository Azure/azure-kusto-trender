import { ADXResponse } from ".";
import {
  ADXTrenderClient,
  HierarchiesExpandKind,
  PathSearchPayload,
  TagValue,
} from "./ADXTrenderClient";

interface HierachyLevel {
  hits: number;
  name: string;
  children: Record<string, HierachyLevel>;
}

interface TSIHierarchyLevel {
  cumulativeInstanceCount: number;
  name: string;
  hierarchyNodes?: {
    hitCount: number
    hits: TSIHierarchyLevel[]
  };
}



const typeId = "ADX-TYPE-ID";

function highlight(value: string, search: string) {
  return value.replace(search, `<hit>${search}</hit>`)
}

function tagToHit(tag: TagValue, search: string) {

  const id = tag.TimeseriesId == search ? `<hit>${tag.TimeseriesId}</hit>` : tag.TimeseriesId

  return {
    timeSeriesId: [tag.TimeseriesId],
    typeId: typeId, // ⛳️
    name: tag.DisplayName,
    highlights: {
      timeSeriesId: [id],
      description: tag.Path ? tag.Path[tag.Path.length - 1] : undefined, // Use decription for the last path component
      name: highlight(tag.DisplayName, search),
    },
  }
}

function convertHierarchy(h: HierachyLevel) {
  const children = Object.values(h.children)
  const out: TSIHierarchyLevel = {
    name: h.name,
    cumulativeInstanceCount: h.hits,
  };

  if (children.length) {
    out.hierarchyNodes = {
      hitCount: children.length,
      hits: children.map(convertHierarchy)
    }
  }
  return out
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




  async getTimeSeriesTypes() {
    console.log("getTimeSeriesTypes");
    return [
      {
        id: typeId,
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
      GetPathToTimeseriesId(Path, SearchString) | as ${tableName};
      Search_ExactPath(Path, SearchString) | as ${tagsTableName};
    `;

      const result = await this.client.executeQuery(query, {
        parameters: {
          Path: `dynamic(${JSON.stringify(payload.path)})`,
          SearchString: payload.searchString,
        },
      });

      const unfoldedHierarchy = result.unfoldTable<TagValue>(result.getTable(tableName));

      const fullHierarchy: HierachyLevel = {
        hits: 1,
        name: "ROOT",
        children: {},
      };


      unfoldedHierarchy.forEach((hit) => {

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

      const unfoldedTags = result.unfoldTable<TagValue>(result.getTable(tagsTableName));
      return {
        instances: {
          hits: unfoldedTags.map(tag => tagToHit(tag, payload.searchString)),
          hitCount: unfoldedTags.length,
        },
        hierarchyNodes: convertHierarchy(fullHierarchy).hierarchyNodes,
      }
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


    return {
      hierarchyNodes: {
        hits: result.children.map((child) => ({
          name: child.Child,
          cumulativeInstanceCount: child.Count,
        })),

        hitCount: result.children.length,
      },
      instances: {
        hits: result.tags.map(tag => tagToHit(tag, payload.searchString)),
        hitCount: result.tags.length,
      },
    };

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
