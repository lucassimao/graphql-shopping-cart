import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ObjectType,
  OneToMany,
  PrimaryColumn,
  SaveOptions,
} from "typeorm";
import ShoppingCartItem from "./shoppingCartItem";
import { ShoppingCartStatus } from "./shoppingCartStatus";
import { ShoppingCartDTO } from "../dto/shoppingCartDTO";

@Entity()
export default class ShoppingCart extends BaseEntity {
  @PrimaryColumn({ insert: false, update: false, generated: true })
  public id?: number;

  @Column("enum", {
    enum: ["open", "expired", "paid"],
    enumName: "ShoppingCartStatus",
  })
  @Index()
  public status?: ShoppingCartStatus;

  @OneToMany((_type) => ShoppingCartItem, (item) => item.shoppingCart, {
    cascade: true,
  })
  public items?: Promise<ShoppingCartItem[]>;

  public static async save<T extends BaseEntity>(
    this: ObjectType<T>,
    entity: T,
    options?: SaveOptions | undefined
  ): Promise<T> {
    await ShoppingCart.removeOrphanChildren(entity);
    return super.save<T>(entity, options);
  }

  public async save(options?: SaveOptions): Promise<this> {
    await ShoppingCart.removeOrphanChildren(this);
    return super.save(options);
  }

  // this is necessary once typeorm doesn't support automatic orphan removal
  // see https://github.com/typeorm/typeorm/pull/1665
  private static async removeOrphanChildren(
    shoppingCart: ShoppingCart
  ): Promise<void> {
    if (!shoppingCart.id || !shoppingCart?.items) {
      return Promise.resolve();
    }
    const allItems = await shoppingCart.items;

    const itemsToKeep = allItems.filter((item) => typeof item.id === "number");
    const queryBuilder = ShoppingCartItem.createQueryBuilder()
      .delete()
      .where({ shoppingCart });

    if (itemsToKeep.length > 0) {
      const itemsIdsToKeep = itemsToKeep.map((item) => item.id);
      queryBuilder.andWhere("id NOT IN(:...itemsIdsToKeep)", {
        itemsIdsToKeep,
      });
    }
    queryBuilder.execute();
  }

  public constructor(dto?: ShoppingCartDTO) {
    super();
    if (dto) {
      const { id, items, status } = dto;
      if (id) {
        this.id = typeof id === "number" ? id : parseInt(id, 10);
      }
      if (items) {
        this.items = Promise.resolve(items.map((i) => new ShoppingCartItem(i)));
      }
      this.status = status;
    }
  }
}
