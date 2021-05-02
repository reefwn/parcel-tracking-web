import { Field, Int, ObjectType } from "type-graphql";
import { Order } from "./Order";
import {
  Entity,
  Column,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class SocialMedia extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.social)
  orders: Order[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  iconPath: string;
}
