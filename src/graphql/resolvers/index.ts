import { GraphQLResolveInfo } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

import { ShoppingCartDTO } from "../../dto/shoppingCartDTO";
import ShoppingCart from "../../entities/shoppingCart";
import ShoppingCartItem from "../../entities/shoppingCartItem";
import { ShoppingCartFilter } from "../services/shoppingCartFilter";
import {
  filterShoppingCarts,
  findShoppingCartById,
  countShoppingCarts,
} from "../services/shoppingCartService";

type FindById = {
  id: string;
};

type ShoppingCartArgs = {
  filter?: ShoppingCartFilter;
};

type SaveOrUpdateArgs = {
  shoppingCart: ShoppingCartDTO;
};

export const resolvers = {
  DateTime: DateTimeResolver,
  ShoppingCartStatus: {
    PAID: "paid",
    OPEN: "open",
    EXPIRED: "expired",
  },
  Query: {
    countShoppingCarts: (
      _root: any,
      { filter }: ShoppingCartArgs
    ): Promise<number> => countShoppingCarts(filter),
    shoppingCarts: (
      _root: any,
      { filter }: ShoppingCartArgs,
      _context: any,
      info: GraphQLResolveInfo
    ): Promise<ShoppingCart[] | undefined> => filterShoppingCarts(info, filter),
    shoppingCart: (
      _root,
      { id }: FindById,
      _context: any,
      info: GraphQLResolveInfo
    ): Promise<ShoppingCart | undefined> => findShoppingCartById(info, id),
  },
  Mutation: {
    // see https://github.com/typeorm/typeorm/issues/3490
    newShoppingCart: async (_, { shoppingCart: dto }: SaveOrUpdateArgs) => {
      const sp = new ShoppingCart(dto);
      await sp.save();
      await sp.reload();
      return sp;
    },
    deleteShoppingCart: async (_, { id }: FindById) => {
      const result = await ShoppingCart.delete(parseInt(id, 10));
      return result?.affected === 1;
    },
    deleteShoppingCartItem: async (_, { id }: FindById) => {
      const result = await ShoppingCartItem.delete(parseInt(id, 10));
      return result?.affected === 1;
    },
  },
};
