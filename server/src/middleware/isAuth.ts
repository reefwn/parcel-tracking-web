import { NOT_AUTHORIZED } from "../constants";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error(NOT_AUTHORIZED);
  }

  return next();
};
