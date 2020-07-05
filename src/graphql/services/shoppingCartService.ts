import { parseResolveInfo } from "graphql-parse-resolve-info";
import { GraphQLResolveInfo } from "graphql";

import { ShoppingCartFilter } from "./shoppingCartFilter";
import ShoppingCart from "../../entities/shoppingCart";
import { logger } from "../../logger";

const shouldEargerLoadShoppingCartItems = (info: GraphQLResolveInfo) => {
  const resolverInfo = parseResolveInfo(info);
  if (resolverInfo) {
    const resolveTree = resolverInfo.fieldsByTypeName?.ShoppingCart ?? {};
    return "items" in resolveTree;
  }
  return false;
};

const filterToQueryBuilder = (
  eargerLoadItems: boolean,
  filter?: ShoppingCartFilter
) => {
  logger.debug(JSON.stringify(filter));

  const qBuilder = ShoppingCart.createQueryBuilder("p");
  if (eargerLoadItems) {
    qBuilder.leftJoinAndSelect("p.items", "items");
  }

  const statuses = filter?.statuses ?? [];
  if (statuses.length > 0) {
    qBuilder.andWhere("p.status::text IN (:...statuses)", {
      statuses,
    });
  }
  // if (filter?.expirationStart && filter?.expirationEnd) {
  //   qBuilder.andWhere('p.expirationDate between :t0 and :t1', {
  //     t0: filter.expirationStart,
  //     t1: filter.expirationEnd,
  //   })
  // } else if (filter?.expirationStart) {
  //   qBuilder.andWhere('p.expirationDate >= :t0', {
  //     t0: filter.expirationStart,
  //   })
  // } else if (filter?.expirationEnd) {
  //   qBuilder.andWhere('p.expirationDate <= :t1', {
  //     t1: filter.expirationEnd,
  //   })
  // }

  return qBuilder;
};

export const findShoppingCartById = async (
  info: GraphQLResolveInfo,
  id: string
) => {
  const relations = shouldEargerLoadShoppingCartItems(info) ? ["items"] : [];
  return ShoppingCart.findOne({ relations, where: { id: parseInt(id, 10) } });
};

export const filterShoppingCarts = async (
  info: GraphQLResolveInfo,
  filter?: ShoppingCartFilter
) =>
  filterToQueryBuilder(
    shouldEargerLoadShoppingCartItems(info),
    filter
  ).getMany();

export const countShoppingCarts = async (filter?: ShoppingCartFilter) => {
  const qBuilder = filterToQueryBuilder(false, filter);
  return qBuilder.getCount();
};
