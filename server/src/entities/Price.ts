import { Field, ObjectType } from "type-graphql";
import { Product } from "./Product";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

@ObjectType()
@Entity()
export class Price extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id?: number;

  @Field()
  @Column()
  productId!: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.prices)
  product: Product;

  @Field()
  @Column("double precision")
  cost: number;

  @Field()
  @Column("double precision")
  selling: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}
