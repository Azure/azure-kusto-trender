interface PathSearchPayload {
  searchString: string;
  path: string[];
}


export default class HierarchyDelegate {
  async getTimeSeriesTypes() {
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
    return [
      {
        id: "72df205e-c0fd-44c9-9fa8-c62ba720de6c",
        name: "I/O Model",
        source: {
          instanceFieldNames: [
            "L1",
            "L2",
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
            "L8",
            "L9",
            "L10",
            "L11",
          ],
        },
      },
    ];
  }

  async getInstancesSuggestions(text: string) {
    return {
      suggestions: [
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
      ],
    };
  }

  async getInstancesPathSearch(payload: PathSearchPayload) {
    return {
      hierarchyNodes: {
        hits: [
          { name: "Contoso WindFarm Hierarchy", cumulativeInstanceCount: 80 },
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
