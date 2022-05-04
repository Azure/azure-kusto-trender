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

type ADXValue = string | number | boolean | null

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

  get primaryTables() {
    return this.dataTables.filter(
      (table) => table.TableKind == TableKind.PrimaryResult
    );
  }

  getTable(tableName: string) {
    const table = this.dataTables.find((table) => table.TableName == tableName)
    if (table) {
      return table
    }
    throw new Error(`Cannot find table ${tableName} in response`)
  }

  /**
   * Converts an ADX Table (columns, rows) into an array of keyed objects
   *
   * @param table - The raw ADX Data Table to convert
   * @returns An array of native keyed objects
   */

  unfoldTable(table: RawDataTable) {
    return table.Rows.map((row) =>
      table.Columns.reduce((obj, col, i) => {
        obj[col.ColumnName] = row[i];
        return obj;
      }, {})
    );
  }
}
