import { Field, Int, ObjectType } from "type-graphql";
import { Order } from "./Order";
import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class PostalService extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.postal)
  orders: Order[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  iconPath: string;
}
