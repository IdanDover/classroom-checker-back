import AppError from "../../errors/appError";
import {
  FilterFunction,
  LogicOperation,
  PolarWord,
} from "../../models/appTypes";
import ApiFeatures from "./apiFeatures";

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

const filterParams = new FilterParams();
const excludedFields = ["sort", "page", "count"];

const addingFilter = function (
  this: ApiFeatures,
  entry: [string, unknown],
  _index: number,
  _array: [string, unknown][]
) {
  const [field, filterData] = entry as [string, string];

  filterParams.reset().parseParams(filterData.split(";"));

  const { value, filterFn, polarWord, logicOp } = { ...filterParams };

  switch (filterFn) {
    case "between":
      const [min, max] = value.split(",");
      this.filterQuery = this.filterQuery[logicOp](field)[polarWord][filterFn](
        min,
        max
      );
      break;
    case "eq":
    case "equal":
    case "equals":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      this.filterQuery =
        this.filterQuery[logicOp](field)[polarWord][filterFn](value);
      break;
    default:
      throw new AppError(
        "The filter function you provided is not supported",
        400
      );
  }
};

const filter = function (apiFeatures: ApiFeatures) {
  return function () {
    const filterObj: any = { ...apiFeatures.queryObj };

    excludedFields.forEach((field) => delete filterObj[field]);

    Object.entries(filterObj).forEach(addingFilter.bind(apiFeatures));

    return apiFeatures;
  };
};

export = { filter };
