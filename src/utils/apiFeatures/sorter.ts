import ApiFeatures from "./apiFeatures";

const sort = function (apiFeatures: ApiFeatures) {
  return function () {
    if (!("sort" in apiFeatures.queryObj)) return apiFeatures;
    if (typeof apiFeatures.queryObj.sort !== "string") return apiFeatures;
    const [field, sortDirection] = apiFeatures.queryObj.sort.split(",");
    if (sortDirection === "ASC" || sortDirection === "DESC") {
      apiFeatures.sortQuery = apiFeatures.filterQuery.sortBy(
        field,
        sortDirection
      );
      return apiFeatures;
    }
    apiFeatures.sortQuery = apiFeatures.filterQuery.sortAsc(field);
    return apiFeatures;
  };
};

export = { sort };
