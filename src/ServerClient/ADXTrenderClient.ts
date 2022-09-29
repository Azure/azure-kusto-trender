import { StringLiteral } from "typescript";
import { ADXClient } from "./ADXClient";
import { ADXResponse, RawADXResponse } from "./ADXResponse";

export enum HierarchiesExpandKind {
  OneLevel = "OneLevel",
  UntilChildren = "UntilChildren",
}

export interface HierarchiesSearchPayload {
  expand: {
    kind: HierarchiesExpandKind;
  };
}

export interface InstancesSearchPayload {
  recursive?: boolean;
}

export interface PathSearchPayload {
  searchString?: string;
  path?: string[];
  hierarchies?: HierarchiesSearchPayload;
  instances?: InstancesSearchPayload;
}

interface TagMetadata {
  TimeseriesId: string;
  TimeseriesName: string;
  Path: string;
}

interface AvailabilityRange {
  from: string;
  to: string;
}

interface AvailabilityWrapper {
  availabilityCount: Record<"", Record<string, number>>;
}

interface AvailabilityValue {
  range: AvailabilityRange;
  availability: AvailabilityWrapper[];
}

interface HierarchyValue {
  HierarchyName: string;
}

interface ChildValue {
  Child: string;
  Count: number;
}

export interface TagValue {
  TimeseriesId: string;
  DisplayName: string;
  Path?: string[]
}

/**
 * A helper subclass of {@link ADXClient} with trender-specific methods.
 */

export class ADXTrenderClient extends ADXClient {
  /**
   * Returns availability information in a trender-friendly format.
   *
   * @remarks This function always returns a one hour interval.
   */
  async getAvailability() {
    const tableName = "TrenderAvailability";
    const result = await this.executeQuery(
      `GetTotalAvailability() | as ${tableName}`
    );

    const rows = result.getTable(tableName).Rows;

    if (rows.length == 0) {
      throw new Error("Availability array is empty.");
    }

    let from = rows[0][0];
    let to = from;

    const values = rows.reduce((obj, val) => {
      const date = val[0].toString();
      if (date < from) from = date;
      if (date > to) to = date;
      obj[date] = { count: val[1] };
      return obj;
    }, {});

    return {
      availability: [{ availabilityCount: { "": values } }],
      range: {
        to,
        from,
      },
    } as AvailabilityValue;
  }

  /**
   * Returns trender instances
   */
  async getInstances() {
    const tableName = "TrenderInstances";
    const result = await this.executeQuery(`GetInstances() | as ${tableName}`);

    const rows = result.unfoldTable(result.getTable(tableName));

    if (rows.length == 0) {
      throw new Error("Instances array is empty.");
    }

    return rows;
  }

  /**
   * Returns an aggregate over time for the provided tags and time interval.
   */
  async getAggregates(
    tags: string[],
    startDate: Date,
    endDate: Date,
    interval: string
  ) {
    const aggregatesTableName = "TrenderAggregates";
    const metadataTableName = "TrenderMetadata";
    const result = await this.executeQuery(
      "declare query_parameters(TimeSeries:dynamic,StartTime:datetime,EndTime:datetime,Interval:timespan);" +
      `GetAggregates(TimeSeries, StartTime, EndTime, Interval) | order by TimeseriesId | as ${aggregatesTableName};
      GetMetaData(TimeSeries) | as ${metadataTableName}`,
      {
        parameters: {
          TimeSeries: `dynamic(${JSON.stringify(tags)})`,
          StartTime: startDate,
          EndTime: endDate,
          Interval: interval,
        },
      }
    );
    const table = result.getTable(aggregatesTableName);
    const metadataTable = result.getTable(metadataTableName)

    if (table.Rows.length == 0) {
      throw new Error("Aggregates array is empty.");
    }

    if (metadataTable.Rows.length == 0) {
      throw new Error("Aggregates array is empty.");
    }

    const metadata = result.unfoldTable<TagMetadata>(metadataTable).reduce((col, tag) => {
      col[tag.TimeseriesId] = tag;
      return col
    }, {} as Record<string, TagMetadata>)

    const headers = table.Columns.map((c) => c.ColumnName);
    headers.splice(0, 2);

    const grouped = table.Rows.reduce((prev, curr) => {
      const id = curr.shift() as string;
      const timestamp = curr.shift();

      const name = metadata[id].TimeseriesName

      const group = metadata[id].Path.slice(-1)

      if (!prev.hasOwnProperty(group)) {
        prev[group] = {};
      }

      if (!prev[group].hasOwnProperty(name)) {
        prev[group][name] = {};
      }

      prev[group][name][timestamp as string] = headers.reduce((obj, col, i) => {
        obj[col] = curr[i];
        return obj;
      }, {});

      return prev;
    }, {} as Record<string, Record<string, Record<string, unknown>>>);

    console.log(grouped)

    return Object.keys(grouped).map(key => {
      return {
        [key]: grouped[key]
      }
    })
      ;

    // Groups

    const groups = table.Rows.reduce((prev, curr) => {
      const id = curr.shift() as string;
      const timestamp = curr.shift();

      if (!prev.hasOwnProperty(id)) {
        prev[id] = { [id]: {} };
      }

      prev[id][id][timestamp] = headers.reduce((obj, col, i) => {
        obj[col] = curr[i];
        return obj;
      }, {});

      return prev;
    }, {});

    return Object.keys(groups).map((key) => ({ [key]: groups[key] }));
  }

  // #region Hierarch

  /**
   * Returns available hierarchies.
   */
  async getHierarchies() {
    const tableName = "HierarchyList";
    const result = await this.executeQuery(
      `GetHierarchies() | as ${tableName}`
    );

    const rows = result.unfoldTable(result.getTable(tableName));

    if (rows.length == 0) {
      throw new Error("Hierarchies array is empty.");
    }

    return rows as HierarchyValue[];
  }

  async getHierarchyLevel(search: PathSearchPayload) {
    const childrenTableName = "HierarchyChildren";
    const tagsTableName = "HierarchyTags";

    const query = `
      declare query_parameters(Path: dynamic);
      GetTimeseriesIdByPath(Path) | as ${tagsTableName};
      GetChildrenByPath(Path) | as ${childrenTableName};
    `;

    const result = await this.executeQuery(query, {
      parameters: {
        Path: `dynamic(${JSON.stringify(search.path)})`,
      },
    });

    const tags = result.unfoldTable<TagValue>(result.getTable(tagsTableName));
    const children = result.unfoldTable<ChildValue>(
      result.getTable(childrenTableName)
    );

    return {
      tags,
      children,
    };
  }

  async searchTagsAtPath(payload: PathSearchPayload) {
    const tagsTableName = "HierarchyTags"; // ⛳️

    const query = `
      declare query_parameters(Path: dynamic, Search: string);
      SearchTagsAtPath_Henning(Path, Search) | as ${tagsTableName};
    `;

    const result = await this.executeQuery(query, {
      parameters: {
        Path: `dynamic(${JSON.stringify(payload.path)})`,
        Search: payload.searchString,
      },
    });

    return result.unfoldTable<TagValue>(result.getTable(tagsTableName));
  }

  async getChildrenTags(search: PathSearchPayload) {
    const tagsTableName = "HierarchyTags";

    const query = `
      declare query_parameters(Path: dynamic, Search: string);
      Search(Path, Search)
      | as ${tagsTableName};
    `;

    const result = await this.executeQuery(query, {
      parameters: {
        Path: `dynamic(${JSON.stringify(search.path)})`,
        Search: search.searchString,
      },
    });

    return result.unfoldTable<TagValue>(result.getTable(tagsTableName));
  }

  /**
   * Get suggested tag names for a search string.
   */
  async getSuggestions(searchString: string) {
    const tableName = "TrenderSuggestions";

    const query = `
    declare query_parameters(SearchString:string);
    Suggest(SearchString) | as ${tableName}
    `;
    const result = await this.executeQuery(query, {
      parameters: { SearchString: searchString },
    });

    const rows = result.getTable(tableName).Rows.map((row) => row[0] as string);

    return rows;
  }

  // #endregion
}
