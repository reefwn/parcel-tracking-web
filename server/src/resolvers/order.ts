import { OrderProduct } from "../entities/OrderProduct";
import { Product } from "../entities/Product";
import { NOT_AUTHORIZED } from "../constants";
import { isAuth } from "../middleware/isAuth";
import { Order } from "../entities/Order";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Int,
  Root,
  Field,
  Query,
  Mutation,
  Resolver,
  InputType,
  ObjectType,
  FieldResolver,
  UseMiddleware,
} from "type-graphql";

@InputType()
class OrderInput {
  @Field(() => String)
  trackingNumber: string;

  @Field(() => Int)
  socialId: number;

  @Field(() => Int)
  postalId: number;

  @Field(() => [Int])
  productIds: number[];

  @Field(() => [Int])
  productQtys: number[];
}

@ObjectType()
class PaginatedOrders {
  @Field(() => [Order])
  orders: Order[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
class CountOrders {
  @Field(() => Date)
  date: Date;

  @Field(() => Int)
  count: number;
}

@Resolver(Order)
export class OrderResolver {
  @FieldResolver(() => User)
  user(@Root() order: Order, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(order.userId);
  }

  @FieldResolver(() => [Product])
  product(@Root() order: Order) {
    return OrderProduct.find({ orderId: order.id });
  }

  @Query(() => PaginatedOrders)
  @UseMiddleware(isAuth)
  async orders(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedOrders> {
    if (!req.session.userId) {
      throw new Error(NOT_AUTHORIZED);
    }

    const realLimit = Math.min(50, limit);
    const oneExtra = realLimit + 1;
    const replacements: any[] = [oneExtra];

    replacements.push(req.session.userId);

    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIdx = replacements.length;
    }

    const orders = await getConnection().query(
      `
      select o.*
      from "order" o
      where o."deletedAt" is null and o."userId" = $2 ${
        cursor ? `and o."createdAt" < $${cursorIdx}` : ""
      }
      order by o."createdAt" desc
      limit $1
      `,
      replacements
    );

    return {
      orders: orders.slice(0, realLimit),
      hasMore: orders.length === oneExtra,
    };
  }

  @Query(() => Order, { nullable: true })
  @UseMiddleware(isAuth)
  async order(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Order | undefined> {
    const order = await Order.findOne(id);

    if (order?.userId != req.session.userId) {
      throw new Error(NOT_AUTHORIZED);
    }

    return order;
  }

  @Mutation(() => Order)
  @UseMiddleware(isAuth)
  async createOrder(
    @Arg("input") input: OrderInput,
    @Ctx() { req }: MyContext
  ): Promise<Order> {
    console.log("input", input);
    let insertOrderProduct = ``;

    for (let i = 0; i < input.productIds.length; i++) {
      insertOrderProduct += `insert into order_product ("orderId", "productId", quantity) values (currval(pg_get_serial_sequence('order', 'id')), ${input.productIds[i]}, ${input.productQtys[i]});`;
    }

    await getConnection().query(
      `
      start transaction;
      insert into "order" ("userId", "socialId", "postalId", "trackingNumber") values (${req.session.userId}, ${input.socialId}, ${input.postalId}, '${input.trackingNumber}'); ${insertOrderProduct}
      commit;
      `
    );

    const order = await getConnection().query(
      `
      select * from "order" order by "order"."createdAt" desc limit 1;
      `
    );

    console.log("order", order);

    return order[0];
  }

  @Mutation(() => Order, { nullable: true })
  @UseMiddleware(isAuth)
  async updateOrder(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => OrderInput) input: OrderInput,
    @Ctx() { req }: MyContext
  ): Promise<Order> {
    const { trackingNumber } = input;
    const userId = req.session.userId;
    const result = await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({ trackingNumber })
      .where('id = :id and "userId" = :userId', { id, userId })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteOrder(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const order = await Order.findOne(id);

    if (order?.userId != req.session.userId) {
      throw new Error(NOT_AUTHORIZED);
    }

    const response = await Order.update({ id }, { deletedAt: new Date() });

    if (typeof response === "undefined" || response.affected === 0) {
      return false;
    }

    return true;
  }

  @Query(() => [CountOrders])
  @UseMiddleware(isAuth)
  async orders7days(@Ctx() { req }: MyContext): Promise<CountOrders[]> {
    const orders = await getConnection().query(
      `
      select * from
        ( select date::date
          from generate_series (
            current_date - interval '7 days', 
            current_date, 
            interval '1 days'
          ) as "date"
        ) d
      left join (
        select 
          date_trunc('day', "createdAt") as "date",
          count(*) as "orders"
        from "order"
        where "userId" = ${req.session.userId}
        group by "date"
      ) o
      using (date)
      order by date asc;
      `
    );

    let countOrders = orders.map((item: any) => {
      return { date: item.date, count: parseInt(item.orders) || 0 };
    });

    return countOrders;
  }
}
