import { ShoppingCartItemDTO } from "./shoppingCartItemDTO";
import { ShoppingCartStatus } from "../entities/shoppingCartStatus";

export type ShoppingCartDTO = {
  id?: string | number;
  status?: ShoppingCartStatus;
  items?: [ShoppingCartItemDTO];
};
