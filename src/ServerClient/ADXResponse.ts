import { JsonObjectExpression } from "typescript";

export enum FrameType {
  DataTable = "DataTable",
  DataSetHeader = "DataSetHeader",
  DataSetCompletion = "DataSetCompletion",
}

interface RawDataFrameBase {
  FrameType: FrameType;
}

enum TableKind {
  PrimaryResult = "PrimaryResult",
}

interface RawDataTableColumn {
  ColumnName: string;
  ColumnType: string;
}

type ADXValue = string | number | boolean | null;

interface RawDataTable extends RawDataFrameBase {
  TableName: string;
  FrameType: FrameType.DataTable;
  TableKind: TableKind;
  Columns: RawDataTableColumn[];
  Rows: ADXValue[][];
}

interface RawDataSetHeader extends RawDataFrameBase {
  FrameType: FrameType.DataSetHeader;
}

interface RawDataSetCompletion extends RawDataFrameBase {
  FrameType: FrameType.DataSetCompletion;
}

type RawDataFrame = RawDataTable | RawDataSetHeader | RawDataSetCompletion;
export type RawADXResponse = RawDataFrame[];

/**
 * A simple holder class for the ADX Response data.
 *
 * @remarks
 * This class is designed to support the TSI Trender library, not to
 * provide a fully featured ADX client.
 *
 * @see {@link https://docs.microsoft.com/en-us/azure/data-explorer/kusto/api/rest/ API Documentation}
 */

export class ADXResponse {
  dataSetHeader: RawDataSetHeader;
  dataSetCompletion: RawDataSetCompletion;

  dataTables: RawDataTable[] = [];

  constructor(response: RawADXResponse) {
    for (let frame of response) {
      switch (frame.FrameType) {
        case "DataTable":
          this.dataTables.push(frame);
          break;
        case "DataSetHeader":
          this.dataSetHeader = frame;
          break;
        case "DataSetCompletion":
          this.dataSetCompletion = frame;
          break;
      }
    }
  }

  /**
   * Getter for tables marked as primary. Used to easily filter out ADX metadata in the response.
   */

  get primaryTables() {
    return this.dataTables.filter(
      (table) => table.TableKind == TableKind.PrimaryResult
    );
  }

  /**
   * Finds the table with the provided name in the response
   * Use the `as` operator in KQL to name your tables
   *
   * @param tableName - A string to match each table name against
   * @returns The Raw table
   */

  getTable(tableName: string) {
    const table = this.dataTables.find((table) => table.TableName == tableName);
    if (table) {
      return table;
    }
    throw new Error(`Cannot find table ${tableName} in response`);
  }

  /**
   * Converts an ADX Table (columns, rows) into an array of keyed objects
   *
   * @param table - The raw ADX Data Table to convert
   * @returns An array of native keyed objects
   */

  unfoldTable<RowType extends Object>(table: RawDataTable): RowType[] {
    return table.Rows.map((row) =>
      table.Columns.reduce((obj, col, i) => {
        obj[col.ColumnName] = row[i];
        return obj;
      }, {} as RowType)
    );
  }
}
