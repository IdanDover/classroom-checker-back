import { NextFunction, Request, Response } from "express";
import AppError from "../errors/appError";

const whiteListUrlQuery =
  (whiteList: Array<string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const unAllowedQueryParams = Object.keys(query).filter(
      (field) => !whiteList.includes(field)
    );

    if (unAllowedQueryParams.length > 0) {
      return next(
        new AppError(
          `You provided a query param that is not allowed. The query you provided that is not correct is: ${unAllowedQueryParams.join(
            " ;"
          )}, pleas try again after you fix the query`,
          400
        )
      );
    }
    next();
  };

export = { whiteListUrlQuery };
