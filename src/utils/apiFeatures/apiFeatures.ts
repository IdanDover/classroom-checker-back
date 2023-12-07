import { AbstractSearch, Entity, Repository, Search } from "redis-om";
import sorter from "./sorter";
import paginator from "./paginator";
import filter from "./filter";

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

  filter = filter.filter(this);
  sort = sorter.sort(this);
  paginate = paginator.paginate(this);

  returnAll() {
    const query = this.sortQuery ?? this.filterQuery;
    this.promise = query.return.all();
    return this;
  }
}

export = ApiFeatures;
