import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import { myUpdateQuery } from "./myUpdateQuery";
import { isServer } from "./isServer";
import { pipe, tap } from "wonka";
import Router from "next/router";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  DeleteOrderMutationVariables,
  DeleteProductMutationVariables,
  Scalars,
  ChangePasswordMutation,
} from "../generated/graphql";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";

const invalidateEntities = (entity: string, cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === entity);
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", entity, fi.arguments || {});
  });
};

const invalidateEntity = (entity: string, id: Scalars["Int"], cache: Cache) => {
  cache.invalidate({
    __typename: entity,
    id,
  });
};

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

export type MergeMode = "before" | "after";

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

export const cursorPagination = (gqlEntity: string): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      gqlEntity
    );
    info.partial = !isInCache;
    let more = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, gqlEntity) as string[];
      const hasMore = cache.resolve(key, "hasMore");
      if (!hasMore) {
        more = hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: `Paginated${gqlEntity
        .charAt(0)
        .toUpperCase()}${gqlEntity.slice(1)}`,
      orders: results,
      hasMore: more,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: { credentials: "include" as const },
    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          keys: {
            paginatedOrders: () => String,
            paginatedProducts: () => null,
          },
          Query: {
            orders: cursorPagination("orders"),
            products: cursorPagination("products"),
          },
        },
        updates: {
          Mutation: {
            deleteProduct: (_result, args, cache, info) => {
              if (_result.deleteProduct) {
                cache.invalidate({
                  __typename: "Product",
                  id: (args as DeleteProductMutationVariables).id,
                });
              }
            },

            updateProduct: (_result, args, cache, info) => {
              const id = (args as DeleteProductMutationVariables).id;
              invalidateEntity("Product", id, cache);
            },

            createProduct: (_result, args, cache, info) => {
              invalidateEntities("products", cache);
            },

            deleteOrder: (_result, args, cache, info) => {
              if (_result.deleteOrder) {
                cache.invalidate({
                  __typename: "Order",
                  id: (args as DeleteOrderMutationVariables).id,
                });
              }
            },

            createOrder: (_result, args, cache, info) => {
              invalidateEntities("orders", cache);
            },

            changePassword: (_result, args, cache, info) => {
              myUpdateQuery<ChangePasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.changePassword.errors) {
                    return query;
                  } else {
                    return { me: result.changePassword.user };
                  }
                }
              );
              invalidateEntities("orders", cache);
              invalidateEntities("products", cache);
            },

            logout: (_result, args, cache, info) => {
              myUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },

            login: (_result, args, cache, info) => {
              myUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return { me: result.login.user };
                  }
                }
              );
              invalidateEntities("orders", cache);
              invalidateEntities("products", cache);
            },

            // register: (_result, args, cache, info) => {
            //   myUpdateQuery<CreateUserMutation, MeQuery>(
            //     cache,
            //     { query: MeDocument },
            //     _result,
            //     (result, query) => {
            //       if (result.createUser.errors) {
            //         return query;
            //       } else {
            //         return { me: result.createUser.user};
            //       }
            //     }
            //   );
            // },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
