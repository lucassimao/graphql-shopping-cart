import { Min } from "class-validator";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import ShoppingCart from "./shoppingCart";
import { ShoppingCartItemDTO } from "../dto/shoppingCartItemDTO";

@Entity()
export default class ShoppingCartItem extends BaseEntity {
  @PrimaryColumn({ insert: false, update: false, generated: true })
  public id?: number;

  @Column("decimal", { default: 0 })
  @Min(0)
  public price?: number;

  @Column("decimal", { default: 0 })
  @Min(0)
  public quantity?: number;

  // @Column('jsonb', { nullable: true })
  // public stores?: Store[]

  @ManyToOne((_type) => ShoppingCart, (shoppingCart) => shoppingCart.items, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  public readonly shoppingCart?: Promise<ShoppingCart>;

  public constructor(dto?: ShoppingCartItemDTO) {
    super();
    if (dto) {
      const { id, price, quantity } = dto;
      if (id) {
        this.id = typeof id === "number" ? id : parseInt(id, 10);
      }
      this.price = price;
      this.quantity = quantity;
    }
  }
}
