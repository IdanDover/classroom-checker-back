import {
  FilterFunction,
  LogicOperation,
  PolarWord,
} from "../../../models/appTypes";

class FilterParams {
  value: string;
  filterFn: FilterFunction;
  polarWord: PolarWord;
  logicOp: LogicOperation;

  constructor() {
    this.value = "0";
    this.filterFn = "eq";
    this.polarWord = "does";
    this.logicOp = "and";
  }

  parseParams(filterData: Array<string>) {
    switch (filterData.length) {
      case 4:
        [this.logicOp, this.polarWord, this.filterFn, this.value] =
          filterData as [LogicOperation, PolarWord, FilterFunction, string];
        break;
      case 3:
        [this.polarWord, this.filterFn, this.value] = filterData as [
          PolarWord,
          FilterFunction,
          string
        ];
        break;
      case 2:
        [this.filterFn, this.value] = filterData as [FilterFunction, string];
        break;
      case 1:
        [this.value] = filterData;
        break;
    }
  }

  reset() {
    this.value = "0";
    this.filterFn = "eq";
    this.polarWord = "does";
    this.logicOp = "and";
    return this;
  }
}

export = new FilterParams();
