import { Field, Int, ObjectType } from "type-graphql";
import { OrderProduct } from "./OrderProduct";
import { Price } from "./Price";
import { User } from "./User";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @Field()
  @Column()
  name: string;

  @Field()
  price: Price;

  @OneToMany(() => Price, (price) => price.product)
  prices: Price[];

  @Field(() => OrderProduct)
  @OneToMany(() => OrderProduct, (ordprod) => ordprod.product)
  ordprods: OrderProduct[];

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
