import { StringLiteral } from "typescript";
import { ADXClient } from "./ADXClient";
import { ADXResponse, RawADXResponse } from "./ADXResponse";

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
      `GetTotalAvailability('1h') | as ${tableName}`
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

  async getAggregates(
    tags: string[],
    startDate: Date,
    endDate: Date,
    interval: string
  ) {
    const tableName = "TrenderAggregates";
    const result = await this.executeQuery(
      "declare query_parameters(TimeSeries:dynamic,StartTime:datetime,EndTime:datetime,Interval:timespan);" +
        `GetAggregates(TimeSeries, StartTime, EndTime, Interval) | order by TimeSeriesId | as ${tableName}`,
      {
        parameters: {
          TimeSeries: `dynamic(${JSON.stringify(tags)})`,
          StartTime: startDate,
          EndTime: endDate,
          Interval: interval,
        },
      }
    );
    const table = result.getTable(tableName);

    if (table.Rows.length == 0) {
      throw new Error("Aggregates array is empty.");
    }

    const headers = table.Columns.map((c) => c.ColumnName);
    headers.splice(0, 2);

    return [
      {
        "": table.Rows.reduce((prev, curr) => {
          const id = curr.shift() as string;
          const timestamp = curr.shift();

          if (!prev.hasOwnProperty(id)) {
            prev[id] = {};
          }

          prev[id][timestamp] = headers.reduce((obj, col, i) => {
            obj[col] = curr[i];
            return obj;
          }, {});

          return prev;
        }, {}),
      },
    ];


}
