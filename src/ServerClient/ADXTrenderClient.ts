import { StringLiteral } from "typescript";
import { ADXClient } from "./ADXClient";
import { ADXResponse, RawADXResponse } from "./ADXResponse";

interface AvailabilityRange {
  from: string;
  to: string;
}

interface AvailabilityValue {
  range: AvailabilityRange;
  data: Record<string, number>;
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
      `GetAvailability('1h') | as ${tableName}`
    );

    const rows = result.getTable(tableName).Rows;

    if (rows.length == 0) {
      throw new Error("Availability array is empty.");
    }

    const data = rows.reduce((obj, val) => {
      obj[val[0].toString()] = val[1];
      return obj;
    }, {});

    return {
      data,
      range: {
        to: rows[0][0],
        from: rows[rows.length - 1][0],
      },
    } as AvailabilityValue;
  }
}
