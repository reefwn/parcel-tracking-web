import { NOT_AUTHORIZED } from "../constants";
import { isAuth } from "../middleware/isAuth";
import { Product } from "../entities/Product";
import { Price } from "../entities/Price";
import { User } from "../entities/User";
import { getConnection } from "typeorm";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

@InputType()
class ProductInput {
  @Field()
  name: string;

  @Field()
  cost: number;

  @Field()
  selling: number;
}

@ObjectType()
class PaginatedProducts {
  @Field(() => [Product])
  products: Product[];

  @Field()
  hasMore: boolean;
}

@Resolver(Product)
export class ProductResolver {
  @FieldResolver(() => User)
  user(@Root() product: Product, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(product.userId);
  }

  @FieldResolver(() => Price)
  async price(@Root() product: Product) {
    const price = await getConnection().query(
      `
      select * from price where "productId" = ${product.id} order by "createdAt" desc limit 1;
      `
    );

    return price[0];
  }

  @Query(() => PaginatedProducts)
  @UseMiddleware(isAuth)
  async products(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedProducts> {
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

    const products = await getConnection().query(
      `
      select prod.*
      from "product" prod
      where prod."deletedAt" is null and prod."userId" = $2
      ${cursor ? `and prod."createdAt" < $${cursorIdx}` : ""}
      order by prod."createdAt" desc
      limit $1
      `,
      replacements
    );

    return {
      products: products.slice(0, realLimit),
      hasMore: products.length === oneExtra,
    };
  }

  @Query(() => [Product])
  @UseMiddleware(isAuth)
  myProducts(@Ctx() { req }: MyContext) {
    return Product.find({ userId: req.session.userId });
  }

  @Query(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  product(@Arg("id", () => Int) id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async createProduct(
    @Arg("input") { name, cost, selling }: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<Product> {
    await getConnection().query(
      `
      start transaction;
      insert into product ("name", "userId") values ('${name}', ${req.session.userId});
      insert into price ("productId", cost, selling) values (currval(pg_get_serial_sequence('product', 'id')), ${cost}, ${selling});
      commit;
      `
    );

    const product = await getConnection().query(
      `
      select * from product order by product."createdAt" desc limit 1;
      `
    );

    const price = await getConnection().query(
      `
      select * from price where "productId" = ${product[0].id} order by "createdAt" desc limit 1;
      `
    );

    return { ...product[0], price: price[0] };
  }

  @Mutation(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProduct(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: ProductInput,
    @Ctx() { req }: MyContext
  ): Promise<Product> {
    const { name, cost, selling } = input;
    const userId = req.session.userId;

    await getConnection().query(
      `
      start transaction;
      update product set "name" = '${name}' where id = ${id} and "userId" = ${userId};
      insert into price ("productId", cost, selling) values (${id}, ${cost}, ${selling});
      commit;
      `
    );

    const product = await getConnection().query(
      `
      select * from product where id = ${id} order by "createdAt" desc limit 1;
      `
    );

    const price = await getConnection().query(
      `
      select * from price where "productId" = ${product[0].id} order by "createdAt" desc limit 1;
      `
    );

    console.log("test", { ...product[0], price: price[0] });

    return { ...product[0], price: price[0] };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProduct(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const response = await Product.update(
      { id, userId: req.session.userId },
      { deletedAt: new Date() }
    );
    if (typeof response === "undefined" || response.affected === 0) {
      return false;
    }
    return true;
  }
}
