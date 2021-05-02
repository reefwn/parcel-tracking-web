import { Field, ObjectType } from "type-graphql";
import { Product } from "./Product";
import { Order } from "./Order";
import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @PrimaryColumn()
  orderId!: number;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.ordprods)
  order: Order;

  @Field()
  @PrimaryColumn()
  productId!: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.ordprods)
  product: Product;

  @Field()
  @Column({ type: "int" })
  quantity: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
