import { JsonObjectExpression } from "typescript";

interface RawDataFrameBase {
  FrameType: string;
}

enum TableKind {
  PrimaryResult = "PrimaryResult",
}

interface RawDataTableColumn {
  ColumnName: string;
  ColumnType: string;
}

interface RawDataTable extends RawDataFrameBase {
  FrameType: "DataTable";
  TableKind: TableKind;
  Columns: RawDataTableColumn[];
  Rows: JsonObjectExpression[][];
}

interface RawDataSetHeader extends RawDataFrameBase {
  FrameType: "DataSetHeader";
}

interface RawDataSetCompletion extends RawDataFrameBase {
  FrameType: "DataSetCompletion";
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
