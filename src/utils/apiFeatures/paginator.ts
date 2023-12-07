import ApiFeatures from "./apiFeatures";

const paginate = function (apiFeatures: ApiFeatures) {
  return function () {
    const query = apiFeatures.sortQuery ?? apiFeatures.filterQuery;
    if (
      !("page" in apiFeatures.queryObj) ||
      !("count" in apiFeatures.queryObj)
    ) {
      return apiFeatures.returnAll();
    }

    let { page, count } = apiFeatures.queryObj;

    page = Number(page);
    count = Number(count);

    if (typeof page !== "number" || typeof count !== "number") {
      return apiFeatures.returnAll();
    }

    const offset = (page - 1) * count;

    apiFeatures.promise = query.return.page(offset, count);
    return apiFeatures;
  };
};

export = { paginate };
