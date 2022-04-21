interface RawDataFrameBase {
  FrameType: string;
}

interface RawDataTable extends RawDataFrameBase {
  FrameType: "DataTable";
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
}
