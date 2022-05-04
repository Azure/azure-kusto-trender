import { StringLiteral } from "typescript";
import { ADXClient } from "./ADXClient";
import { ADXResponse, RawADXResponse } from "./ADXResponse";

interface AvailabilityRange {
  from: string;
  to: string;
}

interface AvailabilityWrapper{
  availabilityCount: Record<"", Record<string, number>>
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


}
