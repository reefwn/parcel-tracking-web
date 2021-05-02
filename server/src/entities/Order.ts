import { Field, Int, ObjectType } from "type-graphql";
import { PostalService } from "./PostalService";
import { OrderProduct } from "./OrderProduct";
import { User } from "./User";
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SocialMedia } from "./SocialMedia";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  socialId!: number;

  @Field(() => SocialMedia)
  @ManyToOne(() => SocialMedia, (social) => social.orders)
  social: SocialMedia;

  @Field()
  @Column()
  postalId!: number;

  @Field(() => PostalService)
  @ManyToOne(() => PostalService, (postal) => postal.orders)
  postal: PostalService;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Field(() => OrderProduct)
  @OneToMany(() => OrderProduct, (ordprod) => ordprod.order)
  ordprods!: OrderProduct[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customerAcc: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  chatroomId: string;

  @Field()
  @Column()
  trackingNumber: string;

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
