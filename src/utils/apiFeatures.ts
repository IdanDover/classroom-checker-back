import AppError from "../errors/appError";
import {
  FilterFunction,
  LogicOperation,
  PolarWord,
} from "./../models/appTypes";
import { AbstractSearch, Entity, Repository, Search } from "redis-om";

class ApiFeatures {
  filterQuery: Search;
  sortQuery: AbstractSearch | undefined;
  queryObj: object;
  promise: Promise<Entity[]>;

  constructor(repo: Repository, queryObj: object) {
    this.filterQuery = repo.search();
    this.queryObj = queryObj;
    this.promise = repo.search().return.all();
  }

  filter() {
    const filterObj: any = { ...this.queryObj };
    const excludedFields = ["sort", "offset", "count"];
    excludedFields.forEach((field) => delete filterObj[field]);

    Object.entries(filterObj).forEach(this._addingFilter.bind(this));

    return this;
  }

  sort() {
    if (!("sort" in this.queryObj)) return this;

    if (typeof this.queryObj.sort !== "string") return this;

    const [field, sortDirection] = this.queryObj.sort.split(",");

    if (sortDirection === "ASC" || sortDirection === "DESC") {
      this.sortQuery = this.filterQuery.sortBy(field, sortDirection);
      return this;
    }

    this.sortQuery = this.filterQuery.sortAsc(field);
    return this;
  }

  paginate() {
    const query = this.sortQuery ?? this.filterQuery;
    if (!("offset" in this.queryObj) || !("count" in this.queryObj))
      return this.returnAll();

    let { offset, count } = this.queryObj;

    offset = Number(offset);
    count = Number(count);

    if (typeof offset !== "number" || typeof count !== "number")
      return this.returnAll();

    this.promise = query.return.page(offset, count);
    return this;
  }

  returnAll() {
    const query = this.sortQuery ?? this.filterQuery;
    this.promise = query.return.all();
    return this;
  }

  _addingFilter(
    entry: [string, unknown],
    _index: number,
    _array: [string, unknown][]
  ) {
    const [field, filterData] = entry as [string, string];
    let [filterFn, value, polarWord, logicOp] = filterData.split(";") as [
      FilterFunction,
      string,
      PolarWord,
      LogicOperation
    ];

    polarWord = polarWord || "does";
    logicOp = logicOp || "and";

    switch (filterFn) {
      case "between":
        const [min, max] = value.split(",");
        this.filterQuery = this.filterQuery[logicOp](field)[polarWord][
          filterFn
        ](min, max);
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
  }
}

export = ApiFeatures;
