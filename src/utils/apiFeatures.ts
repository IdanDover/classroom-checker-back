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

    Object.entries(filterObj).forEach((entry) => {
      const [field, filterData] = entry as [string, string];
      const [filterFn, value, not] = filterData.split(";");

      if (filterFn === "between") {
        const [min, max] = value.split(",");

        // @ts-ignore
        this.filterQuery = this.filterQuery
          .where(field)
          [`${not ?? "does"}`][filterFn](min, max);

        return this;
      }

      // @ts-ignore
      this.filterQuery = this.filterQuery
        .where(field)
        [`${not ?? "does"}`][filterFn](value);
    });

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
}

export = ApiFeatures;
