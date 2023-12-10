import AppError from "../../../errors/appError";
import ApiFeatures from "../apiFeatures";
import filterParams from "./filterParams";

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
